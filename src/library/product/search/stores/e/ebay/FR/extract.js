const { transform } = require('../format');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'ebay',
    transform,
    domain: 'ebaystores.fr',
    zipcode: '',
  },
  implementation,
};
