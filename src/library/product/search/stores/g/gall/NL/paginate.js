
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'gall',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.c-product-grid',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'gall.nl',
    zipcode: "''",
  },
};