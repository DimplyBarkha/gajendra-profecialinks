
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'FR',
    store: 'cigaretteelec',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//*[contains(text(),"Vous ne trouvez pas votre produit?")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.cigaretteelec.fr/recherche?search_query={searchTerms}&p={page}',
    },
    zipcode: '',
    domain: 'cigaretteelec.fr',
  },
};
