
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'FR',
    store: 'cdiscount',
    nextLinkSelector: 'div[class*="BvPagination"] a[class*="next"]:not(.btdisable)',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="fpFAQRatings"]',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'cdiscount.fr',
    zipcode: '',
  },
};
