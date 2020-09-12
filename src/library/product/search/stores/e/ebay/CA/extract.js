const { transform } = require('../../../../shared')
const { implementation } = require('../shared')

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'ebay',
    transform,
    domain: 'ebay.ca',
    zipcode: '',
  },
  implementation,
};
