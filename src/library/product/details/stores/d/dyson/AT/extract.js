const { transform } = require('../transform');

const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'dyson',
    transform,
    domain: 'dyson.at',
    zipcode: '',
  },
  implementation,
};
