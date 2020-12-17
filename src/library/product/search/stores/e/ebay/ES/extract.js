const { transform } = require('../format');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'ebay',
    transform,
    domain: 'ebay.es',
    zipcode: '',
  },
  implementation,
};
