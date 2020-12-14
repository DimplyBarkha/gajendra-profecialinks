
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'samsclub',
    nextLinkSelector: 'ul > li > button[class*="bv-content-btn"] > .bv-content-btn-pages-next',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ol.bv-content-list-reviews > li',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'samsclub.com',
    zipcode: '',
  },
};
