const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazonApparel',
    domain: 'amazon.de',
    transform: transform,
  },
};
