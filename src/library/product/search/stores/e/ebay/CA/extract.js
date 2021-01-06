const { transform } = require('../format');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'ebay',
    transform,
    domain: 'ebaystores.ca',
    zipcode: '',
  },
  implementation,
};
