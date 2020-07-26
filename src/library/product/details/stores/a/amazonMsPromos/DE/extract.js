const { implementation } = require('../GLOBAL/extract');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazonMsPromos',
    transform: null,
    domain: 'amazon.de',
  },
  implementation,
};
