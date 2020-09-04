const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'dyson',
    transform,
    domain: 'dyson.dk',
    zipcode: '',
  },
  implementation,
};
