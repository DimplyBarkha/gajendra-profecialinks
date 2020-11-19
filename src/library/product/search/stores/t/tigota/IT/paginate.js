
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'tigota',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.products.wrapper.grid.products-grid',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'tigota.it',
    zipcode: "''",
  },
};
