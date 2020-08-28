const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'dyson',
    transform,
    domain: 'dyson.co.uk',
    zipcode: '',
  },
  implementation,
};
