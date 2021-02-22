
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'costco',
    nextLinkSelector: null,
    nextPageUrlSelector: null,
    nextLinkXpath: null,
    mutationSelector: '#BVRRContainer',
    spinnerSelector: null,
    loadedSelector: 'ol.bv-content-list.bv-content-list-reviews',
    loadedXpath: null,
    noResultsXPath: "//div[contains(@id, 'not_found_body')] | //div[contains(@id, 'not_found_error')]",
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'costco.com',
    zipcode: '',
  },
};
