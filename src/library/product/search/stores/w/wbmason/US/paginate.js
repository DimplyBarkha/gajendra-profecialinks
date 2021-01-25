
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'wbmason',
    nextLinkXpath: '//div[@class="so-top"]/div[@class="page-select"]/a[3][@href]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.search-rightcol div#ctl00_ContentPlaceholder1_ProductList_pnlProductsGrid div.grid-row div',
    noResultsXPath: '//span[@id="ctl00_ContentPlaceholder1_NoResultsUC_NoResultsText"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'wbmason.com',
    zipcode: '',
  },
};
