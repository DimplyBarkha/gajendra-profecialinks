const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FI',
    store: 'dyson',
    transform,
    domain: 'fi.dyson.com',
    zipcode: '',
  },
  implementation,
};
