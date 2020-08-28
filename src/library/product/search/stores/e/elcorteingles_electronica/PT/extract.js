const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PT',
    store: 'elcorteingles_electronica',
    transform,
    domain: 'elcorteingles.es',
    zipcode: '',
  },
};
