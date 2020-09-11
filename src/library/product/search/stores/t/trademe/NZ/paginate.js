
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NZ',
    store: 'trademe',
    nextLinkSelector: 'li#o-pagination__nav-item ng-star-inserted',
    mutationSelector: 'h3#tm-search-header-result-count__heading ng-star-inserted',
    spinnerSelector: null,
    loadedSelector:'div#tm-marketplace-search-results__container',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'trademe.co.nz',
    zipcode: "''",
  },
};
