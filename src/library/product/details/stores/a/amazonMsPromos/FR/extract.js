const { implementation } = require('../GLOBAL/extract');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'amazonMsPromos',
    transform: null,
    domain: 'amazon.fr',
  },
  implementation,
};
