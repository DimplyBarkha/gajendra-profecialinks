const { transform } = require('../transform');

const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'dyson',
    transform,
    domain: 'fi.dyson.com',
    zipcode: '',
  },
  implementation,
};
