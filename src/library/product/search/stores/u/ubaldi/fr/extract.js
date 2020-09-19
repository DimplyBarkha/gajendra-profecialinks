const { transform } = require('../format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'fr',
    store: 'ubaldi',
    transform: transform,
    domain: 'ubaldi.com',
    zipcode: "''",
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 40000) {
          await stall(40000);
          scrollTop += 40000;
          window.scroll(0, scrollTop);
          if (scrollTop === 40000) {
            await stall(40000);
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
    await new Promise((resolve, reject) => setTimeout(resolve, 30000));
    await applyScroll(context);
    return await context.extract(productDetails, { transform });
  },
};
