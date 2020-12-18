
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'lowes',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section#main',
    loadedXpath: null,
    noResultsXPath: '//h1[contains(text(), "This Page Is Missing or Moved")] | //p[@class="subTitle"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'lowes.com',
    zipcode: '',
  },
};
