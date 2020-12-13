
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'FR',
    store: 'melectronics',
    nextLinkSelector: 'div.p-product-listing--item__buttons > button.btn__secondary',
    nextLinkXpath: null,
    mutationSelector: 'div.p-product-listing--row',
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
