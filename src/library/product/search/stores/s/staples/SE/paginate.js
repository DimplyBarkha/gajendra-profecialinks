
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'staples',
    nextLinkSelector: 'div#Pager>span.next',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'main>div#PageInner',
    loadedXpath: null,
    noResultsXPath: '//div[@id="divSearch"]/div[contains(@class,"dvNoResults")]/h1',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'staples.se',
    zipcode: '',
  },
};
