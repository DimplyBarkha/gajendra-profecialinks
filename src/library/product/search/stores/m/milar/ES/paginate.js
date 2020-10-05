
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'milar',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#df-results__dfclassic',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'milar.es',
    zipcode: '',
  },
};
