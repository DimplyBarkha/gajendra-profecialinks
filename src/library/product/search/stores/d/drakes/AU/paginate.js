
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'drakes',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedXpath: '//div[@class="shopping-list search_results"]',
    noResultsXPath: '//div[@class="search-results__empty-message"]//p[text()="No results found"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      pageStartNb: 1,
      template: 'https://062.drakes.com.au/search?page={page}&q={searchTerms}&utf8=%E2%9C%93',
    },
    domain: 'drakes.com.au',
    zipcode: '',
  },
};
