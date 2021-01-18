module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'medpex',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    openSearchDefinition: {
      template: 'https://www.medpex.de/search.do?q={searchTerms}&pn={page}',
    },
    domain: 'medpex.de',
  },
};
