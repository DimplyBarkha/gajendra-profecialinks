
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NZ',
    store: 'countdown',
    nextLinkSelector: 'a[aria-label="Next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '//wnz-search[@class="ng-star-inserted"]',
    noResultsXPath: '//search-no-results[@class="ng-star-inserted"]',
    openSearchDefinition: null,
    domain: 'countdown.co.nz',
    zipcode: '',
  },
};
