
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'IT',
    store: 'sephora',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#main div#main-js',
    loadedXpath: null,
    noResultsXPath: '//div[@id="main"]//div[@id="primary"]/div[@class="no-hits-content"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'sephora.it',
    zipcode: '',
  },
};
