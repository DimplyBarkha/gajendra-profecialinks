const { transform } = require('../../amazonPharmapacks/US/shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonRuna',
    transform,
    domain: 'amazon.com',
  },
};
