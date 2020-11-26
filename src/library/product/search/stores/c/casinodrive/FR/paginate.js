
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'casinodrive',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="lazyload"] ul[class*="prodlist"]',
    loadedXpath: null,
    noResultsXPath: '//span[@class="msg-design sorry big "]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'casinodrive.fr',
    zipcode: '',
  },
};
