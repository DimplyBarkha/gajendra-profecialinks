const { transform } = require('../shared')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'mediaexpert',
    transform,
    zipcode: '',
    domain: 'mediaexpert.pl',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      var clickButton = document.querySelector('a[data-component="triggerClick"]');
      if (clickButton) {
        clickButton.click();
      }
    })
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(1000);
            break;
          }
        }
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    return await context.extract(productDetails, { transform });
  }
};
