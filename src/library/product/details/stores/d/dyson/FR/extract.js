const { transform } = require('../transform');

const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'dyson',
    transform,
    domain: 'dyson.fr',
    zipcode: '',
  },
  implementation,
};
