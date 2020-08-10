const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/geo/geoExtract',
  parameterValues: {
    country: 'ES',
    store: 'carrefourSupermercado',
    transform,
    domain: 'carrefour.es',
    zipcode: '',
  },
};
