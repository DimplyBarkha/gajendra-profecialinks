
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'DE',
    store: 'melectronics',
    nextLinkSelector: 'div.p-product-listing--item__buttons > button.btn__secondary',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//h2[contains(text(),"Leider konnten wir für Ihre Suche keine Ergebnisse finden. Vielleicht hilft dies:")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'melectronics.ch',
    zipcode: "''",
  },
};
