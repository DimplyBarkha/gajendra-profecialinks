
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'walmart',
    nextLinkSelector: 'div[data-automation="pagination-root"] a[data-automation="pagination-next-button"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#product-results div[data-automation="product"]',
    noResultsXPath: '//h1[@data-automation="null-results-message"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'walmart.ca',
    zipcode: '',
  },
};
