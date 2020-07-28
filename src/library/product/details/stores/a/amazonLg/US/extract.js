const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonLg',
    transform: transform,
    domain: 'amazon.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const element = document.getElementById('aplus');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        await new Promise((resolve) => setTimeout(resolve, 2197));
      }
      try {
        await context.waitForXPath('//div[@id="aplus"]/..//h2 | //div[@id="aplus"]/..//div[contains(@class, "celwidget aplus-module")]');
      } catch (error) {
        console.log('error: ', error);
      }
      await new Promise((resolve) => setTimeout(resolve, 2197));
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const url = window.location.href;
      // @ts-ignore
      let currency = document.querySelector('[id="priceblock_ourprice"]');
      // @ts-ignore
      currency = currency !== null ? currency.innerText : '';
      // @ts-ignore
      currency = currency.includes('$') ? '$' : '';
      // @ts-ignore
      let manufacturerDescription = document.querySelector('.aplus-v2.desktop.celwidget');
      // @ts-ignore
      manufacturerDescription = manufacturerDescription !== null ? manufacturerDescription.innerText : ' ';
      // @ts-ignore
      manufacturerDescription = manufacturerDescription ? manufacturerDescription.replace(/(\s*[\r\n]\s*)+/g, ' ').trim() : '';
      //=======================================================================
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
      addElementToDocument('ii_otherSellersName', CurrentSeller);
      addElementToDocument('ii_otherSellersPrice', CurrentSellerPrice);
      addElementToDocument('ii_otherSellersShipping', CurrentSellerShipping);
      addElementToDocument('ii_otherSellersPrime', CurrentSellerPrime);
      console.log('CurrentSeller', CurrentSeller);
      console.log('CurrentSellerPrice', CurrentSellerPrice);
      console.log('CurrentSellerShipping', CurrentSellerShipping);
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
      console.log('otherSellersHtml', otherSellersHtml);
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
      sellerNames && addElementToDocument('pd_otherSellerName', sellerNames.join('|'));
      console.log('sellerNames', sellerNames);
      const sellerPrices = [];
      const otherSellersPrice = otherSellersDocument.querySelectorAll(sellerPricesSelector);
      otherSellersPrice && otherSellersPrice.forEach(price => {
        if (price.innerText) {
          sellerPrices.push(price.innerText.trim());
        }
      });
      sellerPrices && addElementToDocument('pd_otherSellersPrice', sellerPrices.join('|'));
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
      sellerPrime && addElementToDocument('pd_otherSellersPrime', sellerPrime.join('|'));
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
      sellerShipping && addElementToDocument('pd_otherSellersShipping2', sellerShipping.join('|'));
      console.log('sellerShipping', sellerShipping);
    }
      //=======================================================================
      addElementToDocument('a_pageTimestamp', (new Date()).toISOString().replace(/[TZ]/g, ' '));
      addElementToDocument('a_url', url);
      addElementToDocument('a_manufacturerDescription', manufacturerDescription);
    });
    return await context.extract(productDetails, { transform: parameters.transform });
  },
};
