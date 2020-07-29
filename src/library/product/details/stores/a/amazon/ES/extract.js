const { transform } = require('./transform');
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    var element = document.querySelectorAll("div[cel_widget_id*='aplus'] img");
    if (element) {
      element.forEach(async (node) => {
        node.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      });
    }
  });
  const otherSellerInfo = async () => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    function getOtherSellersInfo (otherSellersDocument, sellerNamSelector, sellerPricesSelector, sellerPrimeSelector, sellerShippingSelector) {
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
      const sellerPrices = [];
      const otherSellersPrice = otherSellersDocument.querySelectorAll(sellerPricesSelector);
      otherSellersPrice && otherSellersPrice.forEach(price => {
        if (price.innerText) {
          sellerPrices.push(price.innerText.trim().replace('$', ''));
        }
      });
      sellerPrices && addElementToDocument('pd_otherSellersPrice', sellerPrices.join('|'));

      const sellerPrime = [];
      const otherSellersPrime = otherSellersDocument.querySelectorAll(sellerPrimeSelector);
      otherSellersPrime && otherSellersPrime.forEach(prime => {
        if (prime.querySelector('i.a-icon-prime')) {
          sellerPrime.push('Yes');
        } else {
          sellerPrime.push('No');
        }
      });
      sellerPrime && addElementToDocument('pd_otherSellersPrime', sellerPrime.join('|'));

      const sellerShipping = [];
      const otherSellersShipping2 = otherSellersDocument.querySelectorAll(sellerShippingSelector);
      otherSellersShipping2 && otherSellersShipping2.forEach(shipping => {
        shipping = shipping ? shipping.innerText.toLowerCase() : '';
        if (shipping && shipping.includes('gratis')) {
          sellerShipping.push('0.00');
        } else {
          if (shipping) {
            sellerShipping.push(shipping.replace('+', '').replace('.', '').replace(',', '.').trim());
          }
        }
      });
      sellerShipping && addElementToDocument('pd_otherSellersShipping2', sellerShipping.join('|'));
    }
    let otherSellers = document.querySelector('div.olp-link-widget a') ? document.querySelector('div.olp-link-widget a') : document.querySelector('div#mbc span#mbc-olp-link a');
    otherSellers = otherSellers ? otherSellers.href : '';
    if (otherSellers) {
      const otherSellersHtml = await fetch(otherSellers, {
        headers: {
          cookie: document.cookie,
        },
      }).then(res => res.text());
      const domParser = new DOMParser();
      const otherSellersDocument = domParser.parseFromString(otherSellersHtml, 'text/html');
      const pageNotFound = document.evaluate('//title[contains(text(),"Page Not Found")]', otherSellersDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (!pageNotFound) {
        getOtherSellersInfo(otherSellersDocument, 'h3.olpSellerName span , h3.olpSellerName img', 'div.olpOffer span.olpOfferPrice', 'div.olpOffer', 'div.olpOffer .olpShippingInfo');
      }
    } else {
      getOtherSellersInfo('', '#mbc span.mbcMerchantName', '#mbc span.a-color-price.a-size-medium', '#mbc div.a-box.mbc-offer-row', '#mbc div.a-box.mbc-offer-row');
    }
  };
  await context.evaluate(otherSellerInfo);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'amazon',
    transform,
    domain: 'amazon.es',
    zipcode: '28010',
  },
  implementation,
};
