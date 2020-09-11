const { implementation } = require('../shared');
const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'ebay',
    transform,
    domain: 'ebay.fr',
    zipcode: '',
  },
  implementation,
};
