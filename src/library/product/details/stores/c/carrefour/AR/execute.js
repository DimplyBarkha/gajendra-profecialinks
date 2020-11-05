
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AR',
    store: 'carrefour',
    domain: 'carrefouruae.com',
    loadedSelector: 'div.product-name',
    noResultsXPath: "//h1[contains(text(),'Página no encontrada')]",
    zipcode: '',
  },
};
