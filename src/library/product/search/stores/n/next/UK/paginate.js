
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
    loadedSelector: 'div[class*="Results"]',
    loadedXpath: null,
    noResultsXPath: '//div[@class="no-results"] | //div[@class="spell-relaxed"] | //div[@class="SearchedFor"]//div[contains(text(), "0 results")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'next.co.uk',
    zipcode: '',
  },
};
