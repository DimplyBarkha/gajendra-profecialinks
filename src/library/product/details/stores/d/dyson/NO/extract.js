const { transform } = require('../transform');

const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NO',
    store: 'dyson',
    transform,
    domain: 'dyson.no',
    zipcode: '',
  },
  implementation,
};
