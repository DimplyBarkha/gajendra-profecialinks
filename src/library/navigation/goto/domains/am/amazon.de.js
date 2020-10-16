const { implementation } = require('./amazon.com');

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'amazon.de',
    country: 'DE',
    store: 'amazon',
  },
  implementation,
};
