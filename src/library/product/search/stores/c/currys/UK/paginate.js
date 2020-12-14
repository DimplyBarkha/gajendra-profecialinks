
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'currys',
    nextLinkSelector: ".row.tsp.center > ul > li:last-child > a[title='next']",
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="resultList"] div.productListImage',
    loadedXpath: null,
    noResultsXPath: '//section[contains(@class,"sfc")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'currys.co.uk',
    zipcode: '',
  },
};
