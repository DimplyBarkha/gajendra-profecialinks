
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'Petsmart',
    nextLinkSelector: 'li.current-page + li',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul#search-result-items li > .name-link',
    loadedXpath: null,
    noResultsXPath: '//div[@class="search-result-msg-wrapper"]/p[contains(text(),"no results")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'petsmart.com',
    zipcode: '',
  },
};
