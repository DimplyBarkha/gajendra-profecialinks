const { implementation } = require('../shared');
const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'ebay',
    transform,
    domain: 'ebay.ca',
    zipcode: '',
  },
  implementation,
};
