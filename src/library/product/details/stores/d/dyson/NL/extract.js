const { transform } = require('../transform');

const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'dyson',
    transform,
    domain: 'dyson.nl',
    zipcode: '',
  },
  implementation,
};
