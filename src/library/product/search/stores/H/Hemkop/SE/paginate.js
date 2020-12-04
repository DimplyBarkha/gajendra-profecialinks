
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'SE',
    store: 'Hemkop',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//div[@class="ax-no-search-result"]//div[contains(@class,"layout-align-center-center")]//p',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'hemkop.se',
    zipcode: '',
  },
};
