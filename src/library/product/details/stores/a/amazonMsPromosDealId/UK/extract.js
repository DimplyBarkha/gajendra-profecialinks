const { implementation } = require('../GLOBAL/extract');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'amazonMsPromosDealId',
    transform: null,
    domain: 'amazon.co.uk',
  },
  implementation,
};
