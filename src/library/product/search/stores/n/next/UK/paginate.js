
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'UK',
    store: 'next',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class~="Page"]',
    loadedXpath: null,
    noResultsXPath: '//div[@class="no-results"] | //div[@class="spell-relaxed"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'next.co.uk',
    zipcode: '',
  },
};
