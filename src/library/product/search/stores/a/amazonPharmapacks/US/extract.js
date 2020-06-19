const { transform } = require('../../amazon/shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonPharmapacks',
    transform,
    domain: 'amazon.com',
  },
};
