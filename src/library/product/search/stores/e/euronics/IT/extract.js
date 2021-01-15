const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'euronics',
    transform: transform,
    domain: 'euronics.it',
    zipcode: '',
  },
  implementation: async (
      inputs,
      parameters,
      context,
      dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {

    });
    return await context.extract(productDetails, { transform });
  },
};