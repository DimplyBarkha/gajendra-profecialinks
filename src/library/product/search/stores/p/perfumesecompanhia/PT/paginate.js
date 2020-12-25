
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'PT',
    store: 'perfumesecompanhia',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.col.active',
    loadedXpath: '//div[contains(@class, "col ")][contains(@class, " active")]',
    noResultsXPath: '//div[contains(text(), "0 resultados")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'perfumesecompanhia.pt',
    zipcode: '',
  },
};
