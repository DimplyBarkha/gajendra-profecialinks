const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'officeworks',
    transform,
    domain: 'officeworks.com.au',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 5000) {
          await stall(1000);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 5000) {
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
    await applyScroll(context);
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async () => {
      const allProducts = document.querySelectorAll('div[data-ref*="product-tile"]');
      for (let i = 0; i < allProducts.length; i++) {
        allProducts[i].focus();
        await new Promise((resolve, reject) => setTimeout(resolve, 100));
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
