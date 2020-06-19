const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimePantry',
    transform,
    domain: 'amazon.com',
  },
};
