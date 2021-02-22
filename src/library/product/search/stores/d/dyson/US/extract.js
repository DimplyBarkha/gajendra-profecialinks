const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'dyson',
    transform,
    domain: 'dyson.com',
    zipcode: '',
  },
  implementation,
};
