const { transform } = require('../IT/shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'carrefour',
    transform,
    domain: 'carrefour.it',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          scrollTop += 500;
          window.scroll(0, scrollTop);
          await stall(1000);
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
    async function getProductsCount(context) {
      return context.evaluate(async function () {
        const products = document.evaluate('//div[@class="product tile"]//@data-pid', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        return products.snapshotLength;
      });
    }
    return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
  },
};