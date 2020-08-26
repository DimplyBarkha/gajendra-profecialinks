const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_electronica',
    transform,
    domain: 'elcorteingles.es',
  },
};