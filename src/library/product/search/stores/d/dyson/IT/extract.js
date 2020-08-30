const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'dyson',
    transform,
    domain: 'dyson.it',
    zipcode: '',
  },
  implementation,
};
