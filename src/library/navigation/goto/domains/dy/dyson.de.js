const { implementation } = require('./dyson.ae');

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'dyson.de',
    timeout: 60000,
    country: 'DE',
    store: 'dyson',
    zipcode: '',
  },
  implementation,
};
