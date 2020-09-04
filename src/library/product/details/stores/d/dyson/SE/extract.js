const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'dyson',
    transform,
    domain: 'dyson.se',
    zipcode: '',
  },
  implementation,
};
