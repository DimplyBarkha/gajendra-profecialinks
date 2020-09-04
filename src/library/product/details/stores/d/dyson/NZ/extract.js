const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'dyson',
    transform,
    domain: 'dyson.co.nz',
    zipcode: '',
  },
  implementation,
};
