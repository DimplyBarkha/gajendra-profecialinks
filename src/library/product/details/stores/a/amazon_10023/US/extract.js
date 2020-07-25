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

      document.querySelector('body').setAttribute('primeValue', primeValue);
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
    return await context.extract(productDetails, { transform });
  },
};
