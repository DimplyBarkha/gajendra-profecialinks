
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'petstock',
    nextLinkSelector: 'li[class="next"] a:not([href="#"])',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="products"]',
    loadedXpath: null,
    noResultsXPath: '//div[@class="search-no-result"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'petstock.com.au',
    zipcode: '',
  },
};
