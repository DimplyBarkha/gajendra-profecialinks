const { transform } = require('./transform');
// const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SA',
    store: 'dyson',
    transform: null,
    domain: 'dyson.sa',
    zipcode: '',
  },
  // implementation,
};
