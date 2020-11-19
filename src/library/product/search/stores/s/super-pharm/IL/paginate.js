
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IL',
    store: 'super-pharm',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#searchResults',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'super-pharm.co.il',
    zipcode: '',
  },
};
