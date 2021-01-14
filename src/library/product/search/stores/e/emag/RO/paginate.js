
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'RO',
    store: 'emag',
    nextLinkSelector: null,
    nextLinkXpath: '//a[@aria-label="Next"]/span[contains(text(), "Pagina urmatoare")]/parent::a',
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
