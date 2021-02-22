
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
    noResultsXPath: '//div[@data-test="no-result-content"]|//p[contains(. , "Niets gevonden. Resultaten met een deel van de zoekwoorden.")]',
    stopConditionSelectorOrXpath: '//div[@data-test="no-result-content"]|//p[contains(. , "Niets gevonden. Resultaten met een deel van de zoekwoorden.")]',
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.bol.com/nl/s/?page={page}&searchtext={searchTerms}&view=list',
      pageStartNb: 1,
    },
    domain: 'bol.com',
    zipcode: '',
  },
};
