const { transform } = require('../../../../sharedAmazon/transformNew');
/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails, Helpers: { Helpers } } = dependencies;

  const helpers = new Helpers(context);
  await context.evaluate(async () => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const specifications = document.evaluate('//table[contains(@id,"productDetails_techSpec")]//tbody/tr', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const specArray = [];
    if (specifications) {
      for (var i = 0; i < specifications.snapshotLength; i++) {
        specArray.push(specifications.snapshotItem(i).textContent.trim().replace(/\n/g, ' ').replace(/\s+/g, ' : '));
      }
      specArray && specArray.length && addHiddenDiv('ii_spec', specArray.join(' || '));
    }
    const description = document.evaluate('//*[@id="feature-bullets"]/ul/li[not(@id)] | //div[@id="globalStoreInfoBullets_feature_div"]//ul/li | //div[@id="detailBullets_feature_div"]/ul//li', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const descArray = [];
    if (description) {
      for (let i = 0; i < description.snapshotLength; i++) {
        descArray.push(description.snapshotItem(i).textContent.trim());
      }
    }
    const descriptionOne = document.evaluate('//div[@id="productDescription"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (description) {
      descriptionOne && descriptionOne.innerText && descArray.push(`| ${descriptionOne.innerText.trim()}`);
      descArray && descArray[0] && addHiddenDiv('ii_description', `|| ${descArray.join(' || ').trim().replace(/\|\| \|/g, '|')}`);
    }
    const variants = document.evaluate(' //li[@data-defaultasin]/@data-defaultasin | //*[contains(@id,"variation")]//option/@value | //*[contains(@id,"Swatches")]/ul/li//a[@id and contains(@href,"dp")]/@href', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const variantsArray = [];
    if (variants) {
      for (let i = 0; i < variants.snapshotLength; i++) {
        variantsArray.push(variants.snapshotItem(i).textContent.trim());
      }
      variantsArray && addHiddenDiv('ii_variants', variantsArray.join(' | '));
    }
    async function buttonCheck () {
      const button = '#olpLinkWidget_feature_div span[data-action="show-all-offers-display"] a, #mbc-olp-link';
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!document.querySelector(button)) {
        return button;
      } else {
        return 'false';
      }
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
        getLbb(otherSellersDocument);
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
          sellerPrime.push('mazon');
        } else if (prime.querySelector('i.a-icon-prime')) {
          sellerPrime.push('mazon');
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
    // @ts-ignore
    async function getLbb (otherSellersDocument) {
      const button = await buttonCheck();
      const otherSellersDiv = "div#olpOfferList div[class*='olpOffer']";
      console.log('##############################', button);
      if (button !== 'false' && otherSellersDocument.querySelector(otherSellersDiv)) {
        console.log('trying button', button);
        const firstCheck = (document.querySelector('div#shipsFromSoldByInsideBuyBox_feature_div')) ? document.querySelector('div#shipsFromSoldByInsideBuyBox_feature_div') : '';
        const otherSellers = (otherSellersDocument.querySelectorAll(otherSellersDiv)) ? otherSellersDocument.querySelectorAll(otherSellersDiv) : '';
        const price = (document.querySelector("#priceblock_ourprice, [class*='offer-price'], span[id='priceblock_saleprice']")) ? document.querySelector("#priceblock_ourprice, [class*='offer-price'], span[id='priceblock_saleprice']") : '';
        console.log('Sold by box, otherSellers, Actual-price', firstCheck, otherSellers, price);
        if (firstCheck && price) {
          // @ts-ignore
          const priceText = parseFloat((price.innerText).slice(1));
          // @ts-ignore
          if (!(firstCheck.innerText.toLowerCase().includes('sold by amazon')) && otherSellers) {
            otherSellers.forEach((seller) => {
              // @ts-ignore
              const sellerPrice = (seller.querySelector('span.olpOfferPrice')) ? seller.querySelector('span.olpOfferPrice').innerText.trim() : '';
              const priceNum = parseFloat(sellerPrice.slice(1));
              const soldBy = (seller.querySelector('h3.olpSellerName span , h3.olpSellerName img')) ? seller.querySelector('h3.olpSellerName span , h3.olpSellerName img') : '';
              let sellerNames;
              if (soldBy.tagName === 'IMG') {
                sellerNames = (soldBy.alt);
              } else {
                sellerNames = (soldBy.innerText.trim());
              }
              console.log('Name of seller', sellerNames, priceNum, priceText);
              // @ts-ignore
              if (sellerNames.toLowerCase().includes('amazon.sa') && priceNum >= priceText) {
                addHiddenDiv('ii_lbb', 'YES');
                addHiddenDiv('ii_lbbPrice', `${priceNum}`);
              }
            });
          }
        }
      }
    }
  // @ts-ignore
  });
  await helpers.addURLtoDocument('added-url');
  await helpers.addURLtoDocument('added-asin', true);

  await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SA',
    store: 'amazon',
    transform,
    domain: 'amazon.sa',
    zipcode: '',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
  },
  implementation,
};
