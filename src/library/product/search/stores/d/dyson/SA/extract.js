const { transform } = require('./transform');
// const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SA',
    store: 'dyson',
    transform,
    domain: 'dyson.sa',
    zipcode: '',
  },
  // implementation,
};
