const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'dyson',
    transform,
    domain: 'dyson.es',
    zipcode: '',
  },
  implementation,
};
