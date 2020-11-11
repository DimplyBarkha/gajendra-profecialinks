const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'walmarToGo',
    transform,
    domain: 'walmart.com',
  },
};
