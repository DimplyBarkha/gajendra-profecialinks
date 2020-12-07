
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'IT',
    store: 'efarma',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ol.clerk-grid.products-list > li',
    loadedXpath: null,
    noResultsXPath: '//strong[contains(text(), "La tua ricerca non ha dato risultati ma NON ARRENDERTI!")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'efarma.com',
    zipcode: '',
  },
};
