const { transform } = require('./shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'ah',
    transform,
    domain: 'ah.be',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { productDetails } = dependencies;
    const { transform } = parameters;
    return await context.extract(productDetails, { transform });
  },
};
