
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'JP',
    store: 'wowma',
    nextLinkSelector: null,
    nextPageUrlSelector: null,
    nextLinkXpath: '//div[@class="searchListingPagination"]//li[@class="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.searchListingItems',
    loadedXpath: null,
    noResultsXPath: '//div[@class="notFoundMessageArea"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'wowma.jp',
    zipcode: '',
  },
};
