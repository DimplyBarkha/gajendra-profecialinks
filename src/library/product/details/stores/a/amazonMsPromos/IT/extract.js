const { implementation } = require('../GLOBAL/extract');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'amazonMsPromos',
    transform: null,
    domain: 'amazon.it',
  },
  implementation,
};
