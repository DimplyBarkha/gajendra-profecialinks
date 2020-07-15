const { transform } = require('../../amazonPharmapacks/US/shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonRuna',
    transform,
    domain: 'amazon.com',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    const scrollToContent = async (selector) => {
      await context.evaluate(async (selectorToScrollTo) => {

        function scrollToSmoothly(pos, time) {
          return new Promise((res, rej) => {
            if (isNaN(pos)) {
              return rej(new Error("Position must be a number"));
            }
            if (pos < 0) {
              return rej(new Error("Position can not be negative"));
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
              return res();
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

              return res();
            }
          });
        }


        const elem = document.querySelector(selectorToScrollTo);
        await scrollToSmoothly(elem.offsetTop);
      }, selector);
    }

    await scrollToContent('#reviewsMedley');
    await scrollToContent('.askDetailPageSearchWidgetSection');

    try {
      await context.waitForSelector('#aplus', { timeout: 30000 });
    } catch (err) {
      console.log(`Manufacturer details did not load.`);
    }

    await scrollToContent('div[data-cel-widget="aplus_feature_div"]');

    await context.evaluate(async () => {
      let primeValue = 'No';
      const merchantAnchors = document.querySelectorAll('#merchant-info a');
      const buyBoxSpans = document.querySelectorAll('#buybox span');
      const metaNames = document.querySelectorAll('meta[name]');
    
      const findMatchingString = (nodeList) => {
        return new Promise((resolve, reject) => {
          for (const node of nodeList) {
            const text = node.textContent;
    
            if (text.match(/sold by amazon/ig)) {
              return resolve('Yes - Shipped & Sold');
            } else if (text.match(/fulfilled by amazon/ig)) {
              return resolve('Yes - Fulfilled');
            } else if (text.match(/prime pantry/ig)) {
              return resolve('Prime Pantry');
            }
          }
    
          return resolve(undefined);
        });
      };
    
      if (document.querySelector('i#burjActionPanelAddOnBadge.a-icon.a-icon-addon')) {
        primeValue = 'Add-On';
      }
    
      if (document.querySelector('body').innerHTML.match(/Exclusively for Prime Members/ig)) {
        return 'Prime Exclusive';
      }
    
      if (merchantAnchors && merchantAnchors.length) {
        const res = await findMatchingString(merchantAnchors);
    
        if (res) {
          primeValue = res;
        }
      }
    
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
    });

    return await context.extract(productDetails, { transform });
  },
};
