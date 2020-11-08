const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'heb_78204',
    transform: transform,
    domain: 'heb.com',
    zipcode: '78204',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 30000) {
          await stall(10000);
          scrollTop += 3000;
          window.scroll(0, scrollTop);
          if (scrollTop === 25000) {
            await stall(10000);
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
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await applyScroll(context);
    return await context.extract(productDetails, { transform });
  },
};
