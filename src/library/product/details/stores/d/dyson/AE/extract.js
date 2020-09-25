
const { transform } = require('./transform');
// const { implementation } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'dyson',
    transform,
    domain: 'dyson.ae',
    zipcode: '',
  },
  // implementation,
};
