
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'BE',
    store: 'bol',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.product-list',
    loadedXpath: null,
    noResultsXPath: '//div[@data-test="no-result-content"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'bol.com',
    zipcode: '',
  },
};
