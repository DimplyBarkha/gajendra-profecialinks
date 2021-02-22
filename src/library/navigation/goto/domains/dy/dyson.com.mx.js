const { implementation } = require('./dyson.ae');

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'dyson.com.mx',
    timeout: 60000,
    country: 'MX',
    store: 'dyson',
    zipcode: '',
  },
  implementation,
};
