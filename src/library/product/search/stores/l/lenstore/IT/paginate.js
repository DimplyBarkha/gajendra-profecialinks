
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'lenstore',
    nextLinkSelector: 'div[class="search-results-filter-bottom"]>div[class="search-results-filter search-results-filter--right"]>nav[class="_pagination"]>a[class="_pagination__link _pagination__link--next "]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'lenstore.it',
    zipcode: '',
  },
};
