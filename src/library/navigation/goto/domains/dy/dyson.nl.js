const { implementation } = require('./dyson.ae');

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'dyson.nl',
    timeout: 60000,
    country: 'NL',
    store: 'dyson',
    zipcode: '',
  },
  implementation,
};
