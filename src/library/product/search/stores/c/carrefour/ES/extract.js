const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'carrefour',
    transform: transform,
    domain: 'carrefour.es',
  },
};
