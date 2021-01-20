
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NZ',
    store: 'thewarehouse',
    nextLinkSelector: 'div.pagination li.active+li a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: 'div.loader-bg',
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
