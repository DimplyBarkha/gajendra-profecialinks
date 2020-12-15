
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'zooplus',
    nextLinkSelector: '[data-zta="next-btn"]:not(.disabled)',
    nextLinkXpath: null,
    mutationSelector: null,
    // spinnerSelector: 'div[class="search-spinner"]',
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    // openSearchDefinition: {
    //   template: 'https://www.zooplus.fr/esearch.htm#q={searchTerms}&p={page}',
    // },
    domain: 'zooplus.fr',
    zipcode: '',
  },
};
