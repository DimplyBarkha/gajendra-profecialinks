const { transform } = require('../transform');

const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'dyson',
    transform,
    domain: 'dyson.it',
    zipcode: '',
  },
  implementation,
};
