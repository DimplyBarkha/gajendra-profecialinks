module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'DE',
    store: 'medikamente-per-klick',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    openSearchDefinition: {
      template: 'https://www.medikamente-per-klick.de/keywordsearch/searchitem={searchTerms}&page={page}',
    },
    domain: 'medikamenteperklick.de',
  },
};