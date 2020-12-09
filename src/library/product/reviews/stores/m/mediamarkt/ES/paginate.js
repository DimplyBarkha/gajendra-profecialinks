
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'ES',
    store: 'mediamarkt',
    nextLinkSelector: 'li[class*="item-next"]>a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: "//li[contains(@data-bv-v,'contentItem')][contains(@class,'review')]",
    noResultsXPath: "//h3[contains(text(),'no encontramos una coincidencia adecuada para tu búsqueda')]",
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'mediamarkt.es',
    zipcode: '',
  },
};
