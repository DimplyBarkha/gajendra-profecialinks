const { transform } = require('../shared');
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
    try {
      await context.waitForSelector('a[data-component="triggerClick"]', { timeout: 40000 });
      await context.click('a[data-component="triggerClick"]');
    } catch (e) {
      console.log('selector did not load');
    }
    const applyScroll = async function () {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(1000);
          scrollTop += 800;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(1000);
            break;
          }
        }
        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll();
    await context.evaluate(() => {
      var searchUrl = window.location.href;
      var appendElements = document.querySelectorAll('div[class*="c-grid_col is-grid-col-1"]');
      if (appendElements.length) {
        appendElements.forEach((element) => {
          element.setAttribute('searchurl', searchUrl);
        });
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
