const { implementation } = require('../GLOBAL/extract');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'amazonMsPromos',
    transform: null,
    domain: 'amazon.es',
  },
  implementation,
};
