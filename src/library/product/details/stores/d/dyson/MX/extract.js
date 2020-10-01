const { implementation } = require('../common');
const { transform } = require('../transform');

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
