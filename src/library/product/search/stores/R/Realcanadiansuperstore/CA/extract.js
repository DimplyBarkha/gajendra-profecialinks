const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'Realcanadiansuperstore',
    transform,
    domain: 'realcanadiansuperstore.ca',
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

    async function getProductsCount (context) {
      return context.evaluate(async function () {
        const products = document.evaluate('//div[@class="product-tile__thumbnail__image"]//img/@src', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        return products.snapshotLength;
      });
    }
    await applyScroll(context);
    let productsCount = 0;
    while (productsCount < 150) {
      const doesLoadMoreExists = await context.evaluate(function () {
        return Boolean(document.querySelector('.load-more-button > button[class*="primary-button"]'));
      });

      if (doesLoadMoreExists) {
        await context.evaluate(async function () {
          console.log('Clicking on load more button');
          document.querySelector('.load-more-button > button[class*="primary-button"]').click();
          await new Promise((resolve, reject) => setTimeout(resolve, 10000));
        });
        productsCount = await getProductsCount(context);
        console.log('productsCount' + productsCount);
        if (productsCount >= 150) {
          await applyScroll(context);
          break;
        }
        await applyScroll(context);
      } else {
        break;
      }
    }
    return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
  },
};
