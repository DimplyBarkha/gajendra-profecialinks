
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
    loadedXpath: '//div[@class="col   active"]',
    noResultsXPath: '//div[contains(text(), "0 resultados")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'perfumesecompanhia.pt',
    zipcode: '',
  },
};
