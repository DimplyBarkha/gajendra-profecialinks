const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimeNow_75204',
    transform: transform,
    domain: 'primenow.amazon.com',
  },
};
