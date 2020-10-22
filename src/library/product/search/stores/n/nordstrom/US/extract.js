const { transform } = require('../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'nordstrom',
    transform,
    domain: 'nordstrom.com',
  },
};
