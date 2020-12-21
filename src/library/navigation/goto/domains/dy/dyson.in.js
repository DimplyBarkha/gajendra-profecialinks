const { implementation } = require('./dyson.ae');

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'dyson.in',
    timeout: 50000,
    country: 'IN',
    store: 'dyson',
    zipcode: '',
  },
  implementation,
};
