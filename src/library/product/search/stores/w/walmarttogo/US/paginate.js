
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'walmarttogo',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    nextPageUrlSelector: 'a[id="nextLink"]',
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: 'a[id="nextLink"][href="stop"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'walmarttogo.api',
  },
};
