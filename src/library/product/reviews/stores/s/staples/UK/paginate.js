
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'UK',
    store: 'staples',
    nextLinkSelector: null,
    nextPageUrlSelector: null,
    nextLinkXpath: '//div[@id="skuTabReviews"]//a[@aria-label="Next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#skuTabReviews',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'staples.co.uk',
    zipcode: '',
  },
};
