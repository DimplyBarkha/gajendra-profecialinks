const { implementation } = require('./dyson.ae');

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'dyson.it',
    timeout: 60000,
    country: 'IT',
    store: 'dyson',
    zipcode: '',
  },
  implementation,
};
