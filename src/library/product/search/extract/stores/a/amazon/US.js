const { transform } = require('./base');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    transform,
  },
};
