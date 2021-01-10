
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'DK',
    store: 'lomax',
    // nextLinkSelector: 'a[aria-label="Next"]',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="content"]',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.lomax.dk/soeg/?q={searchTerms}&page={page}',
      },
    domain: 'lomax.dk',
    zipcode: '',
  },
};
