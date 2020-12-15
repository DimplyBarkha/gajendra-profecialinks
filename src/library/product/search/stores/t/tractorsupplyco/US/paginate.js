
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'tractorsupplyco',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#content[role="main"]',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'tractorsupply.com',
    zipcode: '',
  },
};
