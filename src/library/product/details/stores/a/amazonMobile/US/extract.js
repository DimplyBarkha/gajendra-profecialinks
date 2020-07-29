const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonMobile',
    transform,
    domain: 'amazon.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      function addEleToDoc (key, value) {
        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = value;
        prodEle.style.display = 'none';
        document.body.appendChild(prodEle);
      }
      await new Promise(resolve => setTimeout(resolve, 2814));
      let element = document.getElementById('aplus');
      element = element || document.getElementById('detail-bullets');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        await new Promise(resolve => setTimeout(resolve, 2197));
      }
      const specifications = document.querySelectorAll('div[id="detail-bullets"]  ul  li ,  table[id="productDetails_techSpec"]  tbody  tr');
      const data = [];
      specifications && specifications.forEach(item => data.push(item.innerText.trim()));
      addEleToDoc('pd_spec1', data.join(''));
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
        const isNavigated = !!otherSellersDocument;
        otherSellersDocument = otherSellersDocument || document;
        const otherSellersName = otherSellersDocument.querySelectorAll(sellerNamSelector);
        const sellerNames = [];
        otherSellersName.length && otherSellersName.forEach(name => {
          if (name.tagName === 'IMG') {
            sellerNames.push(name.alt);
          } else {
            sellerNames.push(name.innerText.trim());
          }
        });
        sellerNames.length && addElementToDocument('pd_otherSellerName', sellerNames.join('|'));

        // const sellerPrices = [];
        const otherSellersPrice = otherSellersDocument.querySelectorAll(sellerPricesSelector);
        otherSellersPrice.length && otherSellersPrice.forEach(price => {
          if (price.innerText) {
            // sellerPrices.push(price.innerText.trim().replace('$', ''));
            addElementToDocument('pd_otherSellersPrice', price.innerText.trim().replace('$', ''));
          }
        });
        // sellerPrices && addElementToDocument('pd_otherSellersPrice', sellerPrices.join('|'));

        const sellerPrime = [];
        const otherSellersPrime = otherSellersDocument.querySelectorAll(sellerPrimeSelector);
        otherSellersPrime.length && otherSellersPrime.forEach(prime => {
          if (isNavigated) {
            console.log('in navigation', isNavigated);
            if (prime.querySelector('i.a-icon-prime')) {
              sellerPrime.push('Yes');
            } else {
              sellerPrime.push('No');
            }
          } else {
            console.log('no navigation', isNavigated);
            if (prime.includes('Details')) {
              sellerPrime.push('Yes');
            } else {
              sellerPrime.push('No');
            }
          }
        });
        sellerPrime.length && addElementToDocument('pd_otherSellersPrime', sellerPrime.join('|'));

        const sellerShipping = [];
        const otherSellersShipping2 = otherSellersDocument.querySelectorAll(sellerShippingSelector);
        otherSellersShipping2.length && otherSellersShipping2.forEach(shipping => {
          shipping = shipping ? shipping.innerText.toLowerCase() : '';
          if (shipping && shipping.includes('free')) {
            sellerShipping.push('0.00');
          } else if (shipping && shipping.match(/\$([^\s]+)/)) {
            sellerShipping.push(shipping.match(/\$([^\s]+)/)[1]);
          }
        });
        sellerShipping.length && addElementToDocument('pd_otherSellersShipping2', sellerShipping.join('|'));
      }
      let otherSellers = document.querySelector('div#mbc span#mbc-olp-link a');
      otherSellers = otherSellers || document.querySelector('div#unqualifiedBuyBox #unqualified-buybox-olp a');
      otherSellers = otherSellers ? otherSellers.href : '';
      if (otherSellers) {
        const otherSellersHtml = await fetch(otherSellers, {
          headers: {
            cookie: document.cookie,
          },
        }).then(res => res.text()).catch(error => console.log(error));
        const domParser = new DOMParser();
        const otherSellersDocument = domParser.parseFromString(otherSellersHtml, 'text/html');
        const pageNotFound = document.evaluate('//title[contains(text(),"Page Not Found")]', otherSellersDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (!pageNotFound) {
          // getOtherSellersInfo (otherSellersDocument, sellerNamSelector, sellerPricesSelector, sellerPrimeSelector, sellerShippingSelector)
          getOtherSellersInfo(otherSellersDocument, 'h3.olpSellerName span , h3.olpSellerName img', 'div.olpOffer span.olpOfferPrice', 'div.olpOffer', 'div.olpOffer .olpShippingInfo');
        } else {
          getOtherSellersInfo('', '#mbc span.mbcMerchantName', '#mbc span.a-color-price.a-size-medium', '#mbc div.a-box.mbc-offer-row', '#mbc div.a-box.mbc-offer-row');
        }
      } else {
        getOtherSellersInfo('', '#mbc span.mbcMerchantName', '#mbc span.a-color-price.a-size-medium', '#mbc div.a-box.mbc-offer-row', '#mbc div.a-box.mbc-offer-row');
      }
    };
    await context.evaluate(otherSellerInfo);
    return await context.extract(productDetails, { transform });
  },
};
