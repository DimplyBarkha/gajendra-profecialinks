const { transform } = require('../../../../transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonPharmapacks',
    transform,
    domain: 'amazon.com',
  },
};
