const { transform } = require('./transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'euro',
    transform: transform,
    domain: 'euro.com.pl',
    zipcode: '',
  },
};
