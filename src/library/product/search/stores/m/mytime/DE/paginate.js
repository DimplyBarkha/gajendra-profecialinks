
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'DE',
    store: 'mytime',
    nextLinkSelector: null,
    nextLinkXpath: '//a[not(contains(@href, "page=-1"))][@class="nav-category__pagination--next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ol.products-list',
    loadedXpath: null,
    noResultsXPath: '//p[@class="category-view__info"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'mytime.de',
    zipcode: '',
  },
};
