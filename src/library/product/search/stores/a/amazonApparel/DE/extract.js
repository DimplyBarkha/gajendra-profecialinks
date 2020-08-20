const { transform } = require('../../../../transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazonApparel',
    domain: 'amazon.de',
    transform: transform,
  },
};
