const { transform } = require('./shared');
const { productPrimeCheck } = require('./checkPrime');

module.exports = {
  parameterValues: {
    country: 'US',
    transform,
    store: 'amazonPharmapacks',
    domain: 'amazon.com',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(productPrimeCheck)
  }
};