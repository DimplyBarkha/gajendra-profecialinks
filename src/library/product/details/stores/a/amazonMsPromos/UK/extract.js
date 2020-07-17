const { implementation } = require('../GLOBAL/extract');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'amazonMsPromos',
    transform: null,
    domain: 'amazon.com',
  },
  implementation,
};
