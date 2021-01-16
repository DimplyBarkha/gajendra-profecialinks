
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'DE',
    store: 'idealclean',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="LYSContainer_padding__1r8V2"]',
    openSearchDefinition: {
      template: 'https://www2.idealclean.de/search?limit=150&search={searchTerms}&page={page}',
    },
    domain: 'ideal_clean.de',
  },
};