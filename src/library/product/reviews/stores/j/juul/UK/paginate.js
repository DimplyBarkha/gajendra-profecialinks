
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'UK',
    store: 'juul',
    nextLinkSelector: 'a[rel="next"]',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '[class="reviews-amount"]',
    loadedXpath: '[class="reviews-amount"]',
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'juul.co.uk',
    zipcode: '',
  },
};
