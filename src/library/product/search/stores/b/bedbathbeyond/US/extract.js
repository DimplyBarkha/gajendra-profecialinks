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
      if (!document.querySelector('header[class*="SearchHeader"')) {
        throw new Error('Not a Search Page');
      }

      window.scrollTo(0, document.body.scrollHeight);

      const currentUrl = window.location.href;
      document.querySelector('body').setAttribute('searchurl', currentUrl);

      const products = document.querySelectorAll(
        '[data-locator="product_tile_rating"] > span',
      );
      products.forEach((product, index) => {
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
        product.closest('article').setAttribute('rankorganic', `${index + 1}`);
      });
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
