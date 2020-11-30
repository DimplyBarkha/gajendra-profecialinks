const { transform } = require('../transform');

const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'dyson',
    transform,
    domain: 'dyson.es',
    zipcode: '',
  },
  implementation,
};
