const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RO',
    store: 'elefant',
    transform,
    domain: 'elefant.ro',
    zipcode: '',
  },
};
