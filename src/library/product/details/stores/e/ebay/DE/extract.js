const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'ebay',
    transform: null,
    domain: 'ebay.de',
    zipcode: '',
  },
  implementation
};
