const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'dyson',
    transform,
    domain: 'dyson.se',
    zipcode: '',
  },
  implementation,
};
