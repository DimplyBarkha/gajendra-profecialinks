const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'neonet',
    transform: transform,
    domain: 'neonet.pl',
    zipcode: '',
  },
};
