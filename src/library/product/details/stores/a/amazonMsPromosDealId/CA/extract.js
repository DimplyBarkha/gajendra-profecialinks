const { implementation } = require('../GLOBAL/extract');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'amazonMsPromosDealId',
    transform: null,
    domain: 'amazon.ca',
  },
  implementation,
};
