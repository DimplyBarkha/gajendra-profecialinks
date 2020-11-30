const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'dyson',
    transform,
    domain: 'dysoncanada.ca',
    zipcode: '',
  },
  implementation,
};
