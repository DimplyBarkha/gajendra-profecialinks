const { implementation } = require('../GLOBAL/extract');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'amazonMsPromos',
    transform: null,
    domain: 'amazon.ca',
  },
  implementation,
};
