const { transform } = require('../../../../../search/shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonRuna',
    transform: transform,
    domain: 'amazon.com',
  },
};
