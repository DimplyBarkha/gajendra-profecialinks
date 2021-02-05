module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'gracobaby',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="product"] div',
    loadedXpath: null,
    noResultsXPath: '//div[@class="search-tips"]/h5',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      offset: 24,
      template: 'https://www.gracobaby.com/search?q={searchTerms}&start={offset}&sz=24&view=product',
    },
    domain: 'gracobaby.com',
    zipcode: '',
  },
};
