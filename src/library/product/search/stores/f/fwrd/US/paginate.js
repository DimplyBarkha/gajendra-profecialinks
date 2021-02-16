
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'fwrd',
    nextLinkSelector: '#noPagination',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#plp-product-list ul.product-grids li',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'fwrd.com',
    zipcode: '',
  },
};
