const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'dyson',
    transform,
    domain: 'dyson.de',
    zipcode: '',
  },
  implementation,
};
