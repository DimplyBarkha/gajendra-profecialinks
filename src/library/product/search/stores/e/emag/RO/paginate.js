
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'RO',
    store: 'emag',
    nextLinkSelector: 'a[aria-label="Next"]',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="card_grid"]',
    noResultsXPath: '//span[text()="0 rezultate pentru:"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'emag.ro',
    zipcode: '',
  },
};
