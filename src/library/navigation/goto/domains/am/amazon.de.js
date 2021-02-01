const { implementation, dependencies } = require('./amazon');

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'amazon.de',
    timeout: 50000,
    country: 'DE',
    store: 'amazon',
    // store: 'amazonApparel',
  },
  implementation,
  dependencies,
};
