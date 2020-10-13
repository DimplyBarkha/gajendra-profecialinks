const { implementation } = require('../GLOBAL/extract');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'amazonMsPromosDealId',
    transform: null,
    domain: 'amazon.fr',
  },
  implementation,
};
