const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh',
    transform: transform,
    domain: 'amazon.com',
  },
};
