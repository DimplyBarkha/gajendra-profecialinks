
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NZ',
    store: 'countdown',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'wnz-search.ng-star-inserted',
    noResultsXPath: '//search-no-results[@class="ng-star-inserted"]',
    openSearchDefinition: null,
    domain: 'countdown.co.nz',
    zipcode: '',
  },
};
