const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles',
    transform: transform,
    domain: 'elcorteingles.es',
  },
};
