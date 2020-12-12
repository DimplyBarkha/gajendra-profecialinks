
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'ES',
    store: 'fnac',
    nextLinkSelector: null,
    nextLinkXpath: '//button[@class="paginate-item-number js-paginate-item active"]/following::button[@class="paginate-item-number js-paginate-item"][1]',
    // mutationSelector: '[class*="customerReviewsSection-Unit"]',
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'fnac.es',
    zipcode: '',
  },
};
