const { transform } = require('./transform');
// const { implementation } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'dyson',
    transform,
    domain: 'dyson.pl',
    zipcode: '',
  },
  // implementation,
};
