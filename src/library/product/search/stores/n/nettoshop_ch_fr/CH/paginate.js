
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'CH',
    store: 'nettoshop_ch_fr',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      pageStartNb: 0,
      template: 'https://www.nettoshop.ch/search?text={searchTerms}&q=:relevance&page={page}',
    },
    domain: 'nettoshop.ch',
    zipcode: '',
  },
};
