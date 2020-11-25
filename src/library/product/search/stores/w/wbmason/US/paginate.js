
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'wbmason',
    nextLinkSelector: 'a#ctl00_ContentPlaceholder1_ProductList_SearchOptionsHeader_lnkNextPage',
    nextLinkXpath: '//div[@class="so-top"]/div[@class="page-select"]/a[3]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//span[@id="ctl00_ContentPlaceholder1_NoResultsUC_NoResultsText"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'wbmason.com',
    zipcode: '',
  },
};
