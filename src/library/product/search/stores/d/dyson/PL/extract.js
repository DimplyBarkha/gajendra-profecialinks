const { transform } = require('../../../../shared');
// const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'dyson',
    transform,
    domain: 'dyson.pl',
    zipcode: '',
  },
  // implementation,
};
