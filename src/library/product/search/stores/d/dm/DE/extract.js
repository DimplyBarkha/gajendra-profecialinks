const { transform } = require('../format.js');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    transform: transform,
    domain: 'dm.de',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      if (document.querySelector('[data-dmid=load-more-products-button]') != null) {
        while (document.querySelector('[data-dmid=load-more-products-button]').textContent === 'Mehr laden') {
          await new Promise((resolve, reject) => setTimeout(resolve, 25000));
          document.querySelector('[data-dmid=load-more-products-button]').click();
          await new Promise((resolve, reject) => setTimeout(resolve, 25000));
          let scrollTop = 0;
          while (scrollTop !== 10000) {
            await stall(500);
            scrollTop += 1000;
            window.scroll(0, scrollTop);
            if (scrollTop === 10000) {
              await stall(5000);
              break;
            }
          }
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
