
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'zalando_mweb',
    nextLinkSelector: null,
    nextLinkXpath: '//a[@title="nächste Seite" and not(contains(@class, "disabled"))]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'script[id="z-nvg-cognac-props"]',
    loadedXpath: null,
    noResultsXPath: '//span[contains(text(), "Versuche es mit einem anderen Suchbegriff oder prüfe die Schreibweise")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'zalando.de',
    zipcode: '',
  },
};
