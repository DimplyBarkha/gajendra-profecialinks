const { transform } = require('../transform');

const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'dyson',
    transform,
    domain: 'dyson.be',
    zipcode: '',
  },
  implementation,
};
