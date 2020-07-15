const { transform } = require('./shared');
const { productPrimeCheck } = require('../../amazonPharmapacks/US/checkPrime');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    transform,
    store: 'amazonPharmapacks',
    domain: 'amazon.com',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
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
        await scrollToSmoothly(elem.offsetTop);
      }, selector);
    };

    await scrollToContent('#reviewsMedley');
    await scrollToContent('.askDetailPageSearchWidgetSection');

    try {
      await context.waitForSelector('#aplus', { timeout: 30000 });
    } catch (err) {
      console.log('Manufacturer details did not load.');
    }

    await scrollToContent('div[data-cel-widget="aplus_feature_div"]');

    await context.evaluate(productPrimeCheck);

    return await context.extract(productDetails, { transform });
  },
};
