
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'voussert',
    nextLinkSelector: 'span[id="ctl00_cphProduits_DataPagerHaut"] a[class="pagination-next"]',
    nextLinkXpath: '//span[@id="ctl00_cphProduits_DataPagerHaut"]//a[@class="pagination-next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'voussert.fr',
    zipcode: '',
  },
};
