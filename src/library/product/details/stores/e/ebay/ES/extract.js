const { implementation } = require('../shared');
const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'ebay',
    transform,
    domain: 'ebay.es',
    zipcode: '',
  },
  implementation,
};
