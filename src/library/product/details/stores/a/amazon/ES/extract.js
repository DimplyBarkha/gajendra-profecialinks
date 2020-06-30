const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'amazon',
    transform,
    domain: 'amazon.es',
  },
};
