
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'hoogvliet',
    nextLinkSelector: 'a.paginate_wrong_path',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product-list div.product-list-item',
    loadedXpath: null,
    noResultsXPath: '//div[@class="no-search-result"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'hoogvliet.com',
    zipcode: "''",
  },
};
