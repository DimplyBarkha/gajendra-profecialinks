const { implementation } = require('../common');
const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'dyson',
    transform,
    domain: 'dyson.com.mx',
    zipcode: '',
  },
  implementation,
};
