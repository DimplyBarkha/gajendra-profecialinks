
const { implementation } = require('../common');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'dyson',
    transform: null,
    domain: 'dyson.in',
    zipcode: '',
  },
  implementation,
};
