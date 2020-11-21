const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'FootLocker',
    transform,
    domain: 'footlocker.co.uk',
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
        const products = document.evaluate('//div[@class="fl-product-tile--basic"]//picture[@class="fl-picture"]/img/@srcset', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        return products.snapshotLength;
      });
    }  
    let productsCount = 0;
    while (productsCount < 150) {
      const doesLoadMoreExists = await context.evaluate(function () {
        return Boolean(document.querySelector('.text-center > div > .fl-btn--inner'));
      });  
      if (doesLoadMoreExists) {
        await context.evaluate(async function () {
          console.log('Clicking on load more button');
          document.querySelector('.text-center > div > .fl-btn--inner').click();
          await new Promise((resolve, reject) => setTimeout(resolve, 10000));
        });
        productsCount = await getProductsCount(context);
        console.log('productsCount' + productsCount);
        if (productsCount >= 150) {
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
