const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'dyson',
    transform,
    domain: 'dyson.nl',
    zipcode: '',
  },
  implementation,
};
