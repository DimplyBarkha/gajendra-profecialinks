const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'linenchest_fr_ca',
    transform: transform,
    domain: 'linenchest.com',
    zipcode: '',
  },
};
