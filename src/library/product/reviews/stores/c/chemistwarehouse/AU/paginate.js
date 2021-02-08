
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'AU',
    store: 'chemistwarehouse',
    nextLinkSelector: null,
    nextPageUrlSelector: null,
    nextLinkXpath: null, //'//*[@id="BVRRContainer"]//div[contains(@class, "bv-content-pagination-container")]/ul/li[contains(@class, "bv-content-pagination-buttons-item bv-content-pagination-buttons-item-next")] | //*[@id="BVRRContainer"]//div[contains(@class, "bv-content-pagination-container")]/ul/li[contains(@class, "bv-content-pagination-buttons-item bv-content-pagination-buttons-item-next")]/button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: '//*[@id="BVRRContainer"]',
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'chemistwarehouse.com.au',
    zipcode: '',
  },
};
