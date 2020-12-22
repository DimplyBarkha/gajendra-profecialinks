
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'FR',
    store: 'cigaretteelec',
    nextLinkSelector: 'button[class*="sr-see-more"]',
    nextLinkXpath: null,
    mutationSelector: 'div.sr-item',
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: 'div.sr-item',
    openSearchDefinition: null,
    zipcode: '',
    domain: 'cigaretteelec.fr',
  },
};
