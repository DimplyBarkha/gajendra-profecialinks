const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'bedbathbeyond',
    transform,
    domain: 'bedbathbeyond.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    await context.evaluate(async () => {
      const currentUrl = window.location.href;

      let scrollTop = 0;
      while (scrollTop !== 15000) {
        await stall(1000);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 15000) {
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

      const productRatings = document.querySelectorAll(
        '[data-locator="product_tile_rating"] > span',
      );
      productRatings.forEach((product) => {
        const denominator =
          Number(
            product.querySelector('svg')
              ? product.querySelector('svg').getAttribute('width')
              : '',
          ) * 2;
        const numerator =
          Number(
            product.querySelector('svg:last-child')
              ? product.querySelector('svg:last-child').getAttribute('width')
              : '',
          ) * 100;
        const rating = (numerator / denominator) / 10;
        const ratingAttr = rating.toFixed(1);
        product.closest('article').setAttribute('rating', ratingAttr);
      });

      const products = document.querySelectorAll('div[class*="ProductGrid-inline"] article');
      products.forEach((product, index) => {
        product.setAttribute('rankorganic', `${index + 1}`);
        product.setAttribute('searchurl', currentUrl);
      });
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
