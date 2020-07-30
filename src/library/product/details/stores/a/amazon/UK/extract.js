const { transform } = require('./format');
async function implementation (
  // @ts-ignore
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    var element = (document.querySelectorAll("div[cel_widget_id*='aplus'] img")) ? document.querySelectorAll("div[cel_widget_id*='aplus'] img") : [];
    if (element) {
      element.forEach(async (node) => {
        node.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      });
    }
    // @ts-ignore
    var CurrentSeller = document.querySelector('div[id="merchant-info"]') ? document.querySelector('div[id="merchant-info"]').innerText : '';
    // @ts-ignore
    var CurrentSellerPrice = document.querySelector("#price_inside_buybox, div[class='olp-text-box'] span[class='a-size-base a-color-price']") ? document.querySelector("#price_inside_buybox, div[class='olp-text-box'] span[class='a-size-base a-color-price']").innerText : '';
    // @ts-ignore
    var CurrentSellerShipping = document.querySelector("div[class='olp-text-box'] span[class='a-color-base']") ? document.querySelector("div[class='olp-text-box'] span[class='a-color-base']").innerText : '';

    // @ts-ignore
    var CurrentSellerPrime = document.querySelector("div[class='olp-text-box'] span[class='a-color-base']") ? document.querySelector("div[class='olp-text-box'] span[class='a-color-base']").innerText : '';

    if (CurrentSeller && CurrentSeller.search('sold by amazon') < 0 && CurrentSeller.match(/sold by (?:(.*) and |(.*).)/i)) {
      CurrentSeller = (CurrentSeller.match(/sold by (?:(.*) and |(.*).)/i)[1]) ? CurrentSeller.match(/sold by (?:(.*) and |(.*).)/i)[1] : CurrentSeller.match(/sold by (?:(.*) and |(.*).)/i)[2];
      if (!CurrentSellerShipping) CurrentSellerShipping = '!0.00';
      if (CurrentSellerPrime.includes('Details')) {
        CurrentSellerPrime = 'YES';
      } else {
        CurrentSellerPrime = 'NO';
      }
      addHiddenDiv('ii_otherSellersName', CurrentSeller);
      addHiddenDiv('ii_otherSellersPrice', CurrentSellerPrice);
      addHiddenDiv('ii_otherSellersShipping', CurrentSellerShipping);
      addHiddenDiv('ii_otherSellersPrime', CurrentSellerPrime);
      console.log('CurrentSeller', CurrentSeller);
      console.log('CurrentSellerPrice', CurrentSellerPrice);
      console.log('CurrentSellerShipping', CurrentSellerShipping);
      console.log('CurrentSellerPrime', CurrentSellerPrime);
    }
    let manufacturerDescription = document.querySelector('.aplus-v2.desktop.celwidget');
    // @ts-ignore
    manufacturerDescription = manufacturerDescription !== null ? manufacturerDescription.innerText : '';
    addHiddenDiv('ii_manufacturerDescription', manufacturerDescription);
    // @ts-ignore
    let packSize = document.querySelector("h1[id*='title']").innerText;
    if (packSize.search(/pack of/gmi) > -1) {
      packSize = (packSize.match(/pack of (\d+)/i)[1]) ? packSize.match(/pack of (\d+)/i)[1] : '';
      addHiddenDiv('ii_packSize', packSize);
    }
    var xPathRes = document.evaluate("//td[contains(text(), 'Hersteller')]/following-sibling::*[1] | //th[contains(text(), 'Manufacturer')]/following-sibling::*[1] | //td[contains(text(),'Manufacturer')]/following-sibling::*[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    if (!xPathRes.singleNodeValue) {
      const manufacturerName = document.querySelector("meta[name='keywords']").getAttribute('content');
      if (manufacturerName && manufacturerName.split(',').length > 1) {
        const arr = manufacturerName.split(',');
        const val = arr[arr.length - 2].slice(0, 1).toUpperCase() + arr[arr.length - 2].slice(1);
        addHiddenDiv('ii_manufacturerName', val);
      }
    }
    const otherSellerNew = (document.querySelector("span[data-action='show-all-offers-display'] > a")) ? document.querySelector("span[data-action='show-all-offers-display'] > a").getAttribute('href') : '';
    if (otherSellerNew) {
      const otherSellersHtml = await fetch(otherSellerNew, {
        headers: {
          cookie: document.cookie,
        },
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
      }).then(res => res.text());
      // console.log('otherSellersHtml', otherSellersHtml);
      const domParser = new DOMParser();
      const otherSellersDocument = domParser.parseFromString(otherSellersHtml, 'text/html');
      const pageNotFound = document.evaluate('//title[contains(text(),"Page Not Found")]', otherSellersDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (!pageNotFound) {
        getOtherSellersInfo(otherSellersDocument, 'h3.olpSellerName span , h3.olpSellerName img', 'div.olpOffer span.olpOfferPrice', 'div.olpOffer', 'div.olpOffer .olpShippingInfo');
      } else {
        getOtherSellersInfo('', '#mbc span.mbcMerchantName, #ii_otherSellersName', 'div[id*="mbc"] span[id*="mbc-price"], #ii_otherSellersPrice', "span[id*='mbc-shipping'], #ii_otherSellersPrime", 'div[id*="mbc"] span[id*="mbc-shipping"], #ii_otherSellersShipping');
      }
    } else {
      getOtherSellersInfo('', '#mbc span.mbcMerchantName, #ii_otherSellersName', 'div[id*="mbc"] span[id*="mbc-price"], #ii_otherSellersPrice', "span[id*='mbc-shipping'], #ii_otherSellersPrime", 'div[id*="mbc"] span[id*="mbc-shipping"], #ii_otherSellersShipping');
    }
    function getOtherSellersInfo (otherSellersDocument, sellerNamSelector, sellerPricesSelector, sellerPrimeSelector, sellerShippingSelector) {
      const samePageFlag = !otherSellersDocument ? 1 : 0;
      otherSellersDocument = otherSellersDocument || document;
      const otherSellersName = otherSellersDocument.querySelectorAll(sellerNamSelector);
      const sellerNames = [];
      otherSellersName && otherSellersName.forEach(name => {
        if (name.tagName === 'IMG') {
          sellerNames.push(name.alt);
        } else {
          sellerNames.push(name.innerText.trim());
        }
      });
      sellerNames && addHiddenDiv('pd_otherSellerName', sellerNames.join('|'));
      console.log('sellerNames', sellerNames);
      const sellerPrices = [];
      const otherSellersPrice = otherSellersDocument.querySelectorAll(sellerPricesSelector);
      otherSellersPrice && otherSellersPrice.forEach(price => {
        if (price.innerText) {
          sellerPrices.push(price.innerText.trim());
          addHiddenDiv('pd_otherSellersPrice', price.innerText.trim());
        }
      });
      // sellerPrices && addHiddenDiv('pd_otherSellersPrice', sellerPrices.join('|'));
      console.log('sellerPrices', sellerPrices);
      const sellerPrime = [];
      const otherSellersPrime = otherSellersDocument.querySelectorAll(sellerPrimeSelector);
      otherSellersPrime && otherSellersPrime.forEach(prime => {
        if (prime.innerText.includes('Details') && samePageFlag) {
          sellerPrime.push('Yes');
        } else if (prime.querySelector('i.a-icon-prime')) {
          sellerPrime.push('Yes');
        } else {
          sellerPrime.push('No');
        }
      });
      sellerPrime && addHiddenDiv('pd_otherSellersPrime', sellerPrime.join('|'));
      console.log('sellerPrime', sellerPrime);
      const sellerShipping = [];
      const otherSellersShipping2 = otherSellersDocument.querySelectorAll(sellerShippingSelector);
      otherSellersShipping2 && otherSellersShipping2.forEach(shipping => {
        shipping = shipping ? shipping.innerText.toLowerCase() : '';
        if (shipping && shipping.includes('free')) {
          sellerShipping.push('0.00');
        } else if (shipping && shipping.match(/.([\d]+(?:.[\d]+)?)/)) {
          sellerShipping.push(shipping.match(/.([\d]+(?:.[\d]+)?)/)[1]);
        }
      });
      while (sellerShipping.length !== sellerNames.length) {
        sellerShipping.push('0.00');
      }
      sellerShipping && addHiddenDiv('pd_otherSellersShipping2', sellerShipping.join('|'));
      console.log('sellerShipping', sellerShipping);
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    transform,
    domain: 'amazon.co.uk',
    zipcode: 'SW1P 3EU',
  },
  implementation,
};
