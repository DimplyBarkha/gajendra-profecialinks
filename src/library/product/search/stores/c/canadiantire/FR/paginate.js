
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    template: null,
    country: 'FR',
    store: 'canadiantire',
    // nextLinkSelector: null,
    // nextLinkXpath: '//div[@class="search-results-grid__load-more-results"]/a',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="search-results-grid__content"]',
    loadedXpath: '//div[@class="search-results-grid__content"]',
    noResultsXPath: '//span[@class="g-s-no-results__top-message-heading-text"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'canadiantire.ca/fr.html',
    zipcode: '',
  },
};
