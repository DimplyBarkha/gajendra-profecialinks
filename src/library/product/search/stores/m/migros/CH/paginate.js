
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'migros',
    nextLinkSelector: '#submitted-search-products-content > div.products-view-body.search > app-products-display > div:nth-child(3) > div > button',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'migros.ch',
    zipcode: '',
  },
};
