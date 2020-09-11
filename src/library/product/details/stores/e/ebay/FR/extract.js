const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'ebay',
    transform: null,
    domain: 'ebay.fr',
    zipcode: '',
  },
  implementation,
};
