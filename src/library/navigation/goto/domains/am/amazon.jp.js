const { implementation, dependencies } = require('./amazon');

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'amazon.co.jp',
    timeout: 500000,
    country: 'JP',
    store: 'amazon',
    zipcode: '',
  },
  implementation,
  dependencies,
};
