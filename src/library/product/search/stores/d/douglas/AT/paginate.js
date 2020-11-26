
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'douglas',
    nextLinkSelector: '.pagination>a:last-child',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.product-tile:last-child img',
    loadedXpath: null,
    noResultsXPath: '//div[contains(@class,"search-page--empty")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'douglas.at',
    zipcode: '',
  },
};
