const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'doz',
    transform,
    domain: 'doz.pl',
    zipcode: '',
  },
};
