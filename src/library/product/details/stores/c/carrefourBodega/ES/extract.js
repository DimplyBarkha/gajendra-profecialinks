const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'carrefourBodega',
    transform,
    domain: 'carrefour.es',
    zipcode: '',
  },
};
