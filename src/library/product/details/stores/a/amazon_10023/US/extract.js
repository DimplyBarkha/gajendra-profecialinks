const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazon_10023',
    transform,
    domain: 'amazon.com',
    zipcode: '10023',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
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

    const productPrimeCheck = async () => {
      let primeValue = 'No';
      const buyBoxSpans = document.querySelectorAll('div#buybox');
      const metaNames = document.querySelectorAll('meta[name=title]');

      const findMatchingString = (nodeList) => {
        return new Promise((resolve, reject) => {
          for (const node of nodeList) {
            const text = node.tagName === 'META' ? node.content : node.textContent;
            if (text.match(/sold by amazon/ig)) {
              return resolve('Yes - Shipped and Sold');
            } else if (text.match(/fulfilled by amazon/ig)) {
              return resolve('Yes - Fulfilled');
            } else if (text.match(/prime pantry/ig)) {
              return resolve('Prime Pantry');
            }
          }
          return resolve(undefined);
        });
      };

      if (buyBoxSpans && buyBoxSpans.length) {
        const res = await findMatchingString(buyBoxSpans);

        if (res) {
          primeValue = res;
        }
      }

      if (metaNames && metaNames.length) {
        const res = await findMatchingString(metaNames);

        if (res) {
          primeValue = res;
        }
      }
      const catElement = document.createElement('div');
      catElement.id = 'pd_primeValue';
      catElement.textContent = primeValue;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    };
    const scrollToContent = async (selector) => {
      await context.evaluate(async (selectorToScrollTo) => {
        function scrollToSmoothly (pos, time) {
          return new Promise((resolve, reject) => {
            if (isNaN(pos)) {
              return reject(new Error('Position must be a number'));
            }
            if (pos < 0) {
              return reject(new Error('Position can not be negative'));
            }
            var currentPos = window.scrollY || window.screenTop;
            if (currentPos < pos) {
              var t = 10;
              for (let i = currentPos; i <= pos; i += 10) {
                console.log('Scrolling');
                t += 10;
                setTimeout(function () {
                  window.scrollTo(0, i);
                }, t / 2);
              }
              return resolve();
            } else {
              time = time || 100;
              var i = currentPos;
              var x;
              x = setInterval(function () {
                window.scrollTo(0, i);
                i -= 10;
                if (i <= pos) {
                  clearInterval(x);
                }
              }, time);

              return resolve();
            }
          });
        }
        const elem = document.querySelector(selectorToScrollTo);
        if (!elem) {
          return;
        }
        await scrollToSmoothly(elem.offsetTop);
      }, selector);
    };

    try {
      await scrollToContent('#descriptionAndDetails');
    } catch (err) {
      console.log('Product description is not found.');
    }
    try {
      await scrollToContent('#reviewsMedley');
    } catch (err) {
      console.log('reviews did not load.');
    }
    try {
      await scrollToContent('.askDetailPageSearchWidgetSection');
    } catch (err) {
      console.log('Have a question? block not load.');
    }

    try {
      await context.waitForSelector('#aplus', { timeout: 30000 });
    } catch (err) {
      console.log('Manufacturer details did not load.');
    }
    try {
      await scrollToContent('div[data-cel-widget="aplus_feature_div"]');
    } catch (err) {
      console.log('From the manufacturer is not found.');
    }
    await context.evaluate(productPrimeCheck);
    await context.evaluate(otherSellerInfo);
    try {
      await context.waitForXPath('//div[@id="pd_primeValue"]');
    } catch (err) {
      console.log('Prime code not executed..');
    }
    return await context.extract(productDetails, { transform });
  },
};
