const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'ebay',
    transform,
    domain: 'ebay.co.uk',
    zipcode: '',
  },
  implementation,
};
