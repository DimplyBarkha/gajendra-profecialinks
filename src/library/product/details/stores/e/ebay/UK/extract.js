const { implementation } = require('../shared');
const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'ebay',
    transform,
    domain: 'ebay.co.uk',
    zipcode: '',
  },
  implementation,
};
