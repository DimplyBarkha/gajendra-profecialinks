
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'FR',
    store: 'melectronics',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//h2[contains(text(),"Nous n’avons malheureusement pas trouvé de résultat pour votre recherche. Peut-être pouvez-vous essayer ainsi:")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'melectronics.ch',
    zipcode: "''",
  },
};
