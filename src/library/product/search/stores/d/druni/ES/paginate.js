
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'ES',
    store: 'druni',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'figure img',
    noResultsXPath: '//div[contains(@class,"results")]//p[contains(@class,"no-results")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'druni.es',
    zipcode: "''",
  },
};
