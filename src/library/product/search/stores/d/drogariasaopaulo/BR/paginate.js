
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'BR',
    store: 'drogariasaopaulo',
    nextLinkSelector: 'div[class*="text-center btn-load-more"] button[class*="btn btn-primary"]',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="vitrine resultItemsWrapper"] li',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'drogariasaopaulo.com.br',
    zipcode: '',
  },
};
