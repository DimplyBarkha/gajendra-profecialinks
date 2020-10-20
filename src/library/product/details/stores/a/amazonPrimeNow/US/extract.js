const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimeNow',
    transform,
    domain: 'primenow.amazon.com',
  },
};
