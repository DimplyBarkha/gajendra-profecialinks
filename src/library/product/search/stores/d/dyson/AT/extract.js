const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'dyson',
    transform,
    domain: 'dyson.at',
    zipcode: '',
  },
  implementation,
};
