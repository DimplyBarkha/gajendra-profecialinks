
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'NL',
    store: 'bol-im',
    nextLinkSelector: null,
    nextPageUrlSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.results-area',
    loadedXpath: null,
    noResultsXPath: '//div[@data-test="no-result-content"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.bol.com/nl/s/?page={page}&searchtext={searchTerms}&view=list',
      pageStartNb: 1,
    },
    domain: 'bol.com',
    zipcode: '',
  },
};
