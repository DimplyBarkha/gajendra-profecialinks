const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'redzac',
    transform,
    domain: 'redzac.at',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
        const scrollSelector = document.querySelector('div.infinite_scroll__activity_container');
        if (scrollSelector) {
          do {
            scrollSelector.scrollIntoView();
            await stall(1000);
          }
          // @ts-ignore
          while (scrollSelector.style.cssText === '');
        }
      });
    };
    await applyScroll(context);
    await context.evaluate(async function () {
      const allProducts = document.querySelectorAll('li.product_cell');
      let x;
      for (x = 0; allProducts.length - 1 >= x; x++) {
        allProducts[x].setAttribute('count', `${x + 1}`);
      }
      const allProductsReviews = document.querySelectorAll('div.bv-off-screen');
      let y;
      for (y = 0; allProductsReviews.length > y; y++) {
        const newAggregateRating = allProductsReviews[y].textContent.replace(/\./, ',').replace(/0,0/, '').replace(/0\.0/, '');
        allProductsReviews[y].textContent = newAggregateRating;
      }
      const allProductsPrice = document.querySelectorAll('div.single_price');
      let z;
      for (z = 0; allProductsPrice.length > z; z++) {
        const newProductsPrice = allProductsPrice[z].textContent.replace(/[,-]\D/, '');
        allProductsPrice[z].textContent = newProductsPrice;
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
