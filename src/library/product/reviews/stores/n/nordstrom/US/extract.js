const { transform } = require('../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'nordstrom',
    domain: 'nordstrom.com',
    transform: transform,
  },
};
