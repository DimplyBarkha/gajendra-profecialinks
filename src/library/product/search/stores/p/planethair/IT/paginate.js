
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'planethair',
    nextLinkSelector: 'div#pagination_contents > div.ty-pagination a[class*="next"]',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.grid-list',
    loadedXpath: null,
    noResultsXPath: '//p[contains(@class, "no-items")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'planethair.it',
    zipcode: '',
  },
};
