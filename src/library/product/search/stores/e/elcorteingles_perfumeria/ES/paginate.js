
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_perfumeria',
    nextLinkSelector: 'li#pagination-next>a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'elcorteingles.es',
    zipcode: '',
  },
};
