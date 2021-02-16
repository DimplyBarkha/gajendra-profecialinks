
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'costco',
    nextLinkSelector: 'li.bv-content-pagination-buttons-item.bv-content-pagination-buttons-item-next a',
    nextPageUrlSelector: null,
    nextLinkXpath: "//li[contains(@class, 'bv-content-pagination-buttons-item-next')]/a",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ol.bv-content-list.bv-content-list-reviews',
    loadedXpath: null,
    noResultsXPath: "//div[contains(@id, 'not_found_body')]",
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'costco.com',
    zipcode: '',
  },
};
