module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'DE',
    store: 'idealclean',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    openSearchDefinition: {
      template: 'https://www.idealclean.de/search?search={searchTerms}&page={page}',
    },
    domain: 'ideal_clean.de',
  },
};