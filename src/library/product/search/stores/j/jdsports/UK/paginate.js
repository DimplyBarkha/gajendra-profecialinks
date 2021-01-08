
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'JDSports',
    nextLinkSelector:'a[rel="next"]',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector:'body',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath:null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'jdsports.co.uk',
    zipcode: '',
  },
};
