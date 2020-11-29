const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RO',
    store: 'elefant',
    transform,
    domain: 'elefant.ro',
    zipcode: '',
  },
};
