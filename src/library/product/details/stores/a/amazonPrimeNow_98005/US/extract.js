const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimeNow_98005',
    transform,
    domain: 'primenow.amazon.com',
  },
};
