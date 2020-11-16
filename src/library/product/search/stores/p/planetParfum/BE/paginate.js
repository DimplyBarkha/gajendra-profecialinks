
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'planetParfum',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.search-result-content',
    loadedXpath: null,
    noResultsXPath: '//div[@class="no-hits-headline"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'planetparfum.com',
    zipcode: '',
  },
};
