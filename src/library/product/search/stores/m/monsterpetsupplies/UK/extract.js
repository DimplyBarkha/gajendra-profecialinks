const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'monsterpetsupplies',
    transform: transform,
    domain: 'monsterpetsupplies.co.uk',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      const currentUrl = window.location.href;
      const products = document.querySelectorAll('div.product-list-item');
      if (products && products.length > 0) {
        products.forEach(product => {
          product.setAttribute('searchurl', currentUrl);
        });
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
