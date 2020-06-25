
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'carrefour',
    domain: 'carrefour.es',
    url: 'https://www.carrefour.es/supermercado/c?Ntt={searchTerms}',
  },
};
