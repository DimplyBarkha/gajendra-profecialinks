const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimeNow75204',
    transform,
    domain: 'primenow.amazon.com',
  },
};
