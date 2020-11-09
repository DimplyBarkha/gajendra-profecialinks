const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'kohls',
    transform,
    domain: 'kohls.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      const allProducts = document.querySelectorAll('products_grid ');
      let x;
      for (x = 0; allProducts.length - 1 >= x; x++) {
        allProducts[x].setAttribute('count', `${x + 1}`);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
