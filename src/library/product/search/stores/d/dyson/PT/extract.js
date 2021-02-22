const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PT',
    store: 'dyson',
    transform,
    domain: 'dyson.pt',
    zipcode: '',
  },
  implementation,
};
