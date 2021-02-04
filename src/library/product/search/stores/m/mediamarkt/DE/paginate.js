
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'DE',
    store: 'mediamarkt',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//div[@class="ZeroResultsView__PageSection-sc-15n7m0l-0 cZToiD"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      pageStartNb: 1,
      template: 'https://www.mediamarkt.de/de/search.html?&query={searchTerms}&page={page}',
    },
    domain: 'mediamarkt.de',
    zipcode: '',
  },
};
