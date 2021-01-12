
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'misterspex',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.spex-productList__products',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'misterspex.se',
    zipcode: "''",
  },
};
