
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'ES',
    store: 'fnac',
    domain: 'fnac.es',
    loadedSelector: 'section.js-customer-reviews',
    noResultsXPath: 'body.home-page',
    reviewUrl: "https://www.fnac.es/Samsung-Galaxy-A51-6-5-128GB-Azul-Telefono-movil-Smartphone/a7147957",
    sortButtonSelector: null,
    zipcode: "''",
  },
};
