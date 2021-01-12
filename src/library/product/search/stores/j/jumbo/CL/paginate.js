
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'CL',
    store: 'jumbo',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.shelf-list',
    loadedXpath: null,
    noResultsXPath: '//div[contains(@class, "error-404-empty-message")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'jumbo.cl',
    zipcode: '',
  },
};
