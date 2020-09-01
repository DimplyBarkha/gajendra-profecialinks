const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'dyson',
    transform,
    domain: 'dysoncanada.ca',
    zipcode: '',
  },
  implementation,
};
