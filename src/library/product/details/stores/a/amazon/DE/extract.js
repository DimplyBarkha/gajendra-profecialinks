
// const { transform } = require('../../../../sharedAmazon/transformNew');
const { transform } = require('./transform');
// const { implementation } = require('../otherSellersHelper');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails, Helpers: { Helpers }, AmazonHelp: { AmazonHelp } } = dependencies;

  const helpers = new Helpers(context);
  const amazonHelp = new AmazonHelp(context, helpers);

  const free = 'kostenlose';

  await context.evaluate(async (free) => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
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
        console.log('Verkauf durch box, otherSellers, Actual-price', firstCheck, otherSellers, price);
        if (firstCheck && price) {
          // @ts-ignore
          const priceText = parseFloat((price.innerText).slice(1));
          // @ts-ignore
          if (!(firstCheck.innerText.toLowerCase().includes('verkauf durch amazon')) && otherSellers) {
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
              if (sellerNames.toLowerCase().includes('amazon.de') && priceNum >= priceText) {
                addHiddenDiv('ii_lbb', 'YES');
                addHiddenDiv('ii_lbbPrice', `${priceNum}`);
              }
            });
          }
        }
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
        if (shipping && shipping.includes('kostenlose')) {
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
  }, free);

  await amazonHelp.addEnhancedContent();
  await amazonHelp.addCurrentSellerInfo('Verkauf durch Amazon', /Verkauf durch (?:(.*) und |(.*).)/i);

  await helpers.addURLtoDocument('added-url');
  await helpers.addURLtoDocument('added-asin', true);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    transform,
    domain: 'amazon.de',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
  },
  implementation,
};
