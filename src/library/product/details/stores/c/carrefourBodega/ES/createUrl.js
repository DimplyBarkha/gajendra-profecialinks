
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'carrefour.es',
    prefix: null,
    url: 'https://www.carrefour.es/bodega/R-{searchTerm}b/p',
    country: 'ES',
    store: 'carrefourBodega',
    zipcode: '',
  },
};
