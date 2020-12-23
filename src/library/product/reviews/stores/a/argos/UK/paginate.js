
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'UK',
    store: 'argos',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'h2[data-test*="product-name-main"]',
    loadedXpath: null,
    noResultsXPath: '//div[contains(@class,"ErrorPagestyles__Column-sc-1xry310-2 chdxit")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'argos.co.uk',
    zipcode: '',
  },
};
