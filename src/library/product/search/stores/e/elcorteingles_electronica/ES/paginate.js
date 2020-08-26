
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_electronica',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#products-list  ul li img',
    nextLinkSelector: '#pagination-next',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'elcorteingles.es',
    zipcode: '',
  },
};
