const { implementation } = require('../shared');
const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'ebay',
    transform,
    domain: 'ebay.it',
    zipcode: '',
  },
  implementation,
};
