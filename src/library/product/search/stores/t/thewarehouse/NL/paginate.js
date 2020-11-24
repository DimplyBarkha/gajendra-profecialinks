
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'thewarehouse',
    nextLinkSelector: 'li a.paging.next',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul#search-result-items .grid-tile',
    loadedXpath: null,
    noResultsXPath: '//div[@class="no-search-result"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'thewarehouse.co.nz',
    zipcode: "''",
  },
};
