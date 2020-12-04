
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'HU',
    store: 'emag',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="card_grid"]',
    noResultsXPath: '//span[text()="0 rezultate pentru:"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'emag.hu',
    zipcode: '',
  },
};
