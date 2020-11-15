const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'ceneo',
    transform: transform,
    domain: 'ceneo.pl',
    zipcode: '',
  },
};
