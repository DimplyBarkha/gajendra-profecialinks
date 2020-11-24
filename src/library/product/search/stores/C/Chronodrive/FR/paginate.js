
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'Chronodrive',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedXpath: null,
    loadedSelector: '#productListZone > article',
    noResultsXPath: '//div[@id="productListZone"]/p[contains(@class,"msg-nopdt")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'chronodrive.com',
    zipcode: '91160',
  },
};
