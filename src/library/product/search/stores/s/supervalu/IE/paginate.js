
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'supervalu',
    nextLinkSelector: 'div[id="next-page"] a',
    nextLinkXpath: '//div[@id="next-page"]/a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//div[@class="no-search-result"]/p',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'supervalu.ie',
    zipcode: '',
  },
};
