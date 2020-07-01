const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'carrefourBodega',
    transform,
    domain: 'carrefour.es',
    zipcode: '',
  },
};
