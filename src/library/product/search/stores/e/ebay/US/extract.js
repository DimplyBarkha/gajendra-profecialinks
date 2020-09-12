const { transform } = require('../../../../shared')
const { implementation } = require('../shared')

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'ebay',
    transform,
    domain: 'ebay.com',
    zipcode: '',
  },
  implementation,
};
