
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'CA',
    store: 'Realcanadiansuperstore',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: '//div[@class="product-tile__thumbnail__image"]//img/@src',
    noResultsXPath: '//div[@class="search-no-results"]/h2',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'realcanadiansuperstore.ca',
    zipcode: '',
  },
};
