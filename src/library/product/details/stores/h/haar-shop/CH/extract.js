const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'haar-shop',
    transform,
    domain: 'haar-shop.ch',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {

    await context.evaluate(async function () {
      try {

        if (document.querySelector('ol[class*="cs-items-grid__item"] li:first-child')) {
          document.querySelector('ol[class*="cs-items-grid__item"] li:first-child div[class*="cs-product-tile__thumbnail"] >a').click();
        }
      } catch (err) {
        console.log(err)
      }
    });
    await context.waitForSelector('.page-wrapper', { timeout: 60000 });

    await context.evaluate(async function () {

      let scrollTop = 0;
      while (scrollTop <= 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(8000);
          break;
        }
      }
      function stall(ms) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
