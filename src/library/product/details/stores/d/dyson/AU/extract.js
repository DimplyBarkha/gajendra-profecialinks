const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'dyson',
    transform,
    domain: 'dyson.com.au',
    zipcode: '',
  },
  implementation,
};
