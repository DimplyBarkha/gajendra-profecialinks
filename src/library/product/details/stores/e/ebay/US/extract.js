const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'ebay',
    transform: null,
    domain: 'ebay.com',
    zipcode: '',
  },
  implementation,
};
