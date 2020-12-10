const { implementation, dependencies } = require('./amazon');

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'amazon.co.uk',
    timeout: null,
    country: 'UK',
    store: 'amazon',
    zipcode: '',
  },
  implementation,
  dependencies,
};
