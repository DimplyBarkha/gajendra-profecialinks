const { transform } = require('./transform');
// const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SA',
    store: 'dyson',
    transform,
    domain: 'dyson.sa',
    zipcode: '',
  },
  // implementation,
};
