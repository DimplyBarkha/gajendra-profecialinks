const { transform } = require('../../amazonPharmapacks/US/shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonApparel',
    transform,
    domain: 'amazon.com',
  },
};
