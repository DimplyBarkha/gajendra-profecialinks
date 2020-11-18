const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'ceneo',
    transform: transform,
    domain: 'ceneo.pl',
    zipcode: '',
  },
};
