
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'FR',
    store: 'monoprix',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="ui cards products"]',
    loadedXpath: '//div[contains(@class, "ui cards products")]',
    noResultsXPath: '//div[contains(@class,"catalog-page__statistic")]/text()[1][.="0"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'monoprix.fr',
    zipcode: '',
  },
};
