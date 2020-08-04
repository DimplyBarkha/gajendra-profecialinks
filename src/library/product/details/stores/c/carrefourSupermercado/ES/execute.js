
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'carrefourSupermercado',
    domain: 'carrefour.es',
    loadedSelector: "h1[class='product-header__name']",
    noResultsXPath: null,
    zipcode: '',
  },
};
