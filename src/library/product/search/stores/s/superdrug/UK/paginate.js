
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'superdrug',
    nextLinkSelector: 'li.next a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#plp',
    loadedXpath: null,
    noResultsXPath: '//div[@id="no_results"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'superdrug.com',
    zipcode: '',
  },
};
