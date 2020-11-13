
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'drakes',
    nextLinkSelector: null,
    nextLinkXpath: '//a[@class="next_page" and @rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: '//div[@class="shopping-list search_results"]',
    noResultsXPath: '//div[@class="search-results__empty-message"]//p[text()="No results found"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'drakes.com.au',
    zipcode: '',
  },
};
