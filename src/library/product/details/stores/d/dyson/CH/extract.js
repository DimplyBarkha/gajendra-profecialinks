const { transform } = require('../transform');

const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'dyson',
    transform,
    domain: 'dyson.ch',
    zipcode: '',
  },
  implementation,
};
