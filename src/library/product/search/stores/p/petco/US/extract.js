const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'petco',
    transform,
    domain: 'petco.us',
    zipcode: '',
  },

  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 500;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(2000);
            break;
          }
        }
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
            console.log("Scroll");
          });
        }
      });
    };
    await applyScroll(context);
    await context.waitForSelector('.product-image img', { timeout: 10000 });
    return await context.extract(productDetails, { transform });
  },
};
