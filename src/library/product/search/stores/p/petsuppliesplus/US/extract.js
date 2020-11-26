const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'petsuppliesplus',
    transform,
    domain: 'petsuppliesplus.com',
    zipcode: '60440-2380',
  },
};
