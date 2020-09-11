const { implementation } = require('../shared');
const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'ebay',
    transform,
    domain: 'ebay.com.au',
    zipcode: '',
  },
  implementation,
};
