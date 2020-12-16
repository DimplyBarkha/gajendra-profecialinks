module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'misterspex',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.spex-productList__products',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'misterspex.de',
    zipcode: "''",
  },
};