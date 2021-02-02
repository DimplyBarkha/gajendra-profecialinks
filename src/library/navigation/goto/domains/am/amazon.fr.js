const { implementation, dependencies } = require('./amazon');

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'amazon.fr',
    timeout: 50000,
    country: 'FR',
    store: 'amazon',
    zipcode: "''",
  },
  implementation,
  dependencies,
};
