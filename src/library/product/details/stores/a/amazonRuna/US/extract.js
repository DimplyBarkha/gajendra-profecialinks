const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonRuna',
    transform,
    domain: 'amazon.com',
  },
};
