const { transform } = require('./shared');

module.exports = {
  parameterValues: {
    country: 'US',
    transform,
    store: 'amazonPharmapacks',
    domain: 'amazon.com',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    return await context.extract(productDetails, { transform });
  },
};
