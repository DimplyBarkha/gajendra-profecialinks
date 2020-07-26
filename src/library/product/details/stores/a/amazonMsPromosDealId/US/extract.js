const { implementation } = require('../GLOBAL/extract');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonMsPromosDealId',
    transform: null,
    domain: 'amazon.com',
  },
  implementation,
};
