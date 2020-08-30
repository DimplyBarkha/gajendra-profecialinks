const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'dyson',
    transform,
    domain: 'dyson.fr',
    zipcode: '',
  },
  implementation,
};
