
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RS',
    store: 'maxi',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-testid="search-results-list-wrapper"]',
    noResultsXPath: '//div[@class="sc-3brks3-2 iyGbUN"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'maxi.rs',
    zipcode: '',
  },
};
