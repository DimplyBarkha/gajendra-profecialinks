const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'epocacosmeticos',
    transform,
    domain: 'epocacosmeticos.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        let lastScrollPos = 0;
        while (scrollTop !== 7500) {
          await stall(500);
          lastScrollPos = scrollTop;
          scrollTop += 750;
          window.scroll(lastScrollPos, scrollTop);
          if (scrollTop === 7500) {
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
    };
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    await applyScroll(context);
    return await context.extract(productDetails, { transform });
  },
};
