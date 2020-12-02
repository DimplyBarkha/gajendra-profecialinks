
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IL',
    store: 'yenotbitan',
    nextLinkSelector: null,
    nextLinkXpath: '//div[@class="loading-wrapper"]/img',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: '//div[@class="search-products-wrapper"]//div[@class="items"]/div[contains(@class,"item  product")]',
    noResultsXPath: '//div[@class="no-results-message"]/h5',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'ybitan.co.il',
    zipcode: '',
  },
};
