const { transform } = require('../../../../shared')
const { implementation } = require('../shared')

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'ebay',
    transform,
    domain: 'ebay.de',
    zipcode: '',
  },
  implementation,
};
