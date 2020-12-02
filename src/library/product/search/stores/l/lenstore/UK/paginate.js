
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'lenstore',
    nextLinkSelector: 'div[class="search-results-filter-bottom"]>div[class="search-results-filter search-results-filter--right"]>nav[class="_pagination"]>a[class="_pagination__link _pagination__link--next "]',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'lenstore.co.uk',
    zipcode: '',
  },
};
