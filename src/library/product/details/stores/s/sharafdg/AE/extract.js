const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'sharafdg',
    transform,
    domain: 'sharafdg.com',
    zipcode: '',
  },
  implementation: async ({ inputs }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      // Accepting cookies
      const isCookies = document.querySelector('div.cookies btn.btn-white.icon-close');
      if (isCookies) {
        isCookies.click();
      }
      const descTab = document.querySelector('li.prd-desc a');
      try {
        descTab.click();
        await new Promise(resolve => setTimeout(resolve, 10000));
      } catch (e) {
        console.log(e);
      }
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
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
    await context.extract(productDetails, { transform: transformParam });
  },
};
