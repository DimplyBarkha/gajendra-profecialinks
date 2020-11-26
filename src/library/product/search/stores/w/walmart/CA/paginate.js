
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'walmart',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: '//div[@data-automation="pagination-root"]//a[@data-automation="pagination-next-button"]',
    noResultsXPath: '//h1[@data-automation="null-results-message"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'walmart.ca',
    zipcode: '',
  },
};
