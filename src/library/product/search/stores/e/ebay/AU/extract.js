const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'ebay',
    transform,
    domain: 'ebay.com.au',
    zipcode: '',
  },
  implementation,
};
