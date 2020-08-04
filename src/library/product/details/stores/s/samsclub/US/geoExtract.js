const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/geo/geoExtract',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    transform,
    domain: 'samsclub.com',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
