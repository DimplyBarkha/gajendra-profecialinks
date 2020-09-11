const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'ebay',
    transform: null,
    domain: 'ebay.ca',
    zipcode: '',
  },
  implementation,
};
