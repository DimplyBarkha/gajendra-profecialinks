
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'rappi',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '//div[@class="store-products"]',
    loadedXpath: null,
    noResultsXPath: '//div[contains(@class,"no-results ng-star-inserted")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'rappi.com.mx',
    zipcode: '',
  },
};
