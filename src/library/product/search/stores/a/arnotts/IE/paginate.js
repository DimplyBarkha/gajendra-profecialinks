
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'IE',
    store: 'arnotts',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="main"]',
    loadedXpath: '//div[@id="main"]',
    noResultsXPath: '//p[@class="no-hits-content-results"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'arnotts.ie',
    zipcode: "''",
  },
};
