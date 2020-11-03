const { implementation } = require('./mediamarkt.com.tr');

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'mediamarkt.es',
    timeout: 80000,
    store: 'mediamarkt',
    country: 'ES',
    zipcode: '',
  },
  implementation,
};
