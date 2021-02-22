const { transform } = require('../transform');

const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PT',
    store: 'dyson',
    transform,
    domain: 'dyson.pt',
    zipcode: '',
  },
  implementation,
};
