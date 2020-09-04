const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NZ',
    store: 'dyson',
    transform,
    domain: 'dyson.co.nz',
    zipcode: '',
  },
  implementation,
};
