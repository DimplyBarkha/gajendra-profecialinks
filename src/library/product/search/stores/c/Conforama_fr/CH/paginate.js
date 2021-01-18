
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'CH',
    store: 'Conforama_fr',
    // nextLinkSelector: 'div[class="ctrl-navigation ctrl-next"] a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.conforama.ch/fr/recherche-conforama/{searchTerms}?p={page}',
    },
    domain: 'conforama.ch',
    zipcode: '',
  },
};
