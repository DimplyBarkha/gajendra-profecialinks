const { implementation } = require('../GLOBAL/extract');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazonMsPromosDealId',
    transform: null,
    domain: 'amazon.de',
  },
  implementation,
};
