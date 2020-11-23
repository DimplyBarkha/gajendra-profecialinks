
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'ES',
    store: 'fnac',
    nextLinkSelector: null,
  //nextLinkXpath: '//li[@class="paginate-item" and position() = (last()-1)]/button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'fnac.es',
    zipcode: "''",
  },
};
