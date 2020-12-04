const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'doz',
    transform,
    domain: 'doz.pl',
    zipcode: '',
  },
};
