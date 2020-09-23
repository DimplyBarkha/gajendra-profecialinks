
const { implementation } = require('../common');
const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'dyson',
    transform,
    domain: 'dyson.in',
    zipcode: '',
  },
  implementation,
};
