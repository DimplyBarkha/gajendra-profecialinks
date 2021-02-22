const { implementation } = require('./dyson.ae');

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'dyson.pl',
    timeout: 60000,
    country: 'PL',
    store: 'dyson',
    zipcode: '',
  },
  implementation,
};
