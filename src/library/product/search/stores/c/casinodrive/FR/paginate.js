
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'casinodrive',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-synthetics="product-list"]',
    loadedXpath: null,
    noResultsXPath: '//main/div[@data-test="no-products-page"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'casinodrive.fr',
    zipcode: '',
  },
};
