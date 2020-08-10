const { transform } = require('../../../../transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonRuna',
    transform: transform,
    domain: 'amazon.com',
  },
};
