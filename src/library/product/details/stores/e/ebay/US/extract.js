const { implementation } = require('../shared');
const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'ebay',
    transform,
    domain: 'ebay.com',
    zipcode: '',
  },
  implementation,
};
