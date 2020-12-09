const { transform } = require('../../../u/ubaldi/FR/shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'ubaldi',
    transform,
    domain: 'ubaldi.fr',
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
        while (scrollTop !== 30000) {
          scrollTop += 500;
          window.scroll(0, scrollTop);
          await stall(1000);
        }
        function stall (ms)
 {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    async function getProductsCount (context) {
      return context.evaluate(async function () {
        const products = document.evaluate('//div[@id="main-liste-articles"]//div[contains(@class, "la-article")]', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        return products.snapshotLength;
      });
    }
    let productsCount = 0;
    while (productsCount < 150) {
      // await applyScroll(context);
      
        productsCount = await getProductsCount(context);
        console.log('productsCount' + productsCount);
        if (productsCount >= 150) {
          break;
        }
        else await applyScroll(context);
      }
    return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
  },
};
