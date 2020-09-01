const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'dyson',
    transform,
    domain: 'dyson.de',
    zipcode: '',
  },
  implementation,
};
