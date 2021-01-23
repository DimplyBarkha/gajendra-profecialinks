
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'voussert',
    nextLinkSelector: 'span[id="ctl00_cphProduits_DataPagerHaut"] a[class="pagination-next"]:not([disabled])',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.fullGrid.no-space.family-products div.grid25',
    noResultsXPath: '//div[@class="lead wrap"]//div[@class="fullGrid"]/div[@class="grid100"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'voussert.fr',
    zipcode: '',
  },
};
