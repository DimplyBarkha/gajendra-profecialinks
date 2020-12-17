const { transform } = require('../format');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'ebay',
    transform,
    domain: 'ebay.it',
    zipcode: '',
  },
  implementation,
};
