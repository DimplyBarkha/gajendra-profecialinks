
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'canadiantire',
    nextLinkSelector: 'a.search-results-grid__load-more-results__link',
    mutationSelector: 'div[data-component="SearchResultsGrid"]',
    spinnerSelector: null,
    loadedSelector: 'div[data-component="ProductTileSrp"]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'canadiantire.ca',
    zipcode: '',
  },
};
