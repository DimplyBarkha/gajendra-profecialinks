
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'woolworths',
    nextLinkSelector: 'a.paging-next',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: '//div[@class="layoutWrapper"]',
    noResultsXPath: '//span[contains(text(),"Unfortunately, we could")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'woolworths.com.au',
    zipcode: "''",
  },
};
