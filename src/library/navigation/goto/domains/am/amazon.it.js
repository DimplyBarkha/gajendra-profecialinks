const { implementation, dependencies } = require('./amazon');

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'amazon.it',
    timeout: 500000,
    country: 'IT',
    store: 'amazon',
    zipcode: '',
  },
  implementation,
  dependencies,
};
