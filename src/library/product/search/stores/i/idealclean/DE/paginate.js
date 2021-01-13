
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'DE',
    store: 'idealclean',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.LYSContainer_padding__1r8V2',
    openSearchDefinition: {
      template: 'https://www.idealclean.de/search?limit=20&search={searchTerms}&page={page}',
    },
    domain: 'ideal_clean.de',
  },
};