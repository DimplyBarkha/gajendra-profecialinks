const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    transform,
    store: 'amazonPharmapacks',
    domain: 'amazon.com',
  },
};
