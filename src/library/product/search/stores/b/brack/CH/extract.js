// const transform = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'brack',
    transform: null,
    domain: 'brack.ch',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(async () => {
      const products = document.querySelectorAll('li.product-card');
      products.forEach((product, index) => {
        product.setAttribute('rankorganic', `${index + 1}`);
      });
    });

    return await context.extract(productDetails, { transform });
  },
};
