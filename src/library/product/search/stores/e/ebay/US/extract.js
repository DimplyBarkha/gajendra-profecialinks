const { transform } = require('../format');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'ebay',
    transform,
    domain: 'ebaystores.com',
    zipcode: '',
  },
  implementation,
};
