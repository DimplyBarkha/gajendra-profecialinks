const { implementation } = require('./dyson.ae');

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'dyson.com',
    timeout: 60000,
    country: 'US',
    store: 'dyson',
    zipcode: '',
  },
  implementation,
};
