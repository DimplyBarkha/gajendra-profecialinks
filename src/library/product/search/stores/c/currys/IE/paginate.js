
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'IE',
    store: 'currys',
    nextLinkSelector: 'ul.pagination > li > a[title="next"]',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="resultList"] div.productListImage',
    loadedXpath: null,
    noResultsXPath: '//section[contains(@class,"sfc")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'currys.ie',
    zipcode: "''",
  },
};
