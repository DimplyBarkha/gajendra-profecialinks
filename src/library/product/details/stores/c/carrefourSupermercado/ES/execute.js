
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'carrefourSupermercado',
    domain: 'carrefour.es',
    loadedSelector: "div[class='product-pics__container'] img",
    noResultsXPath: null,
    zipcode: '',
  },
};
