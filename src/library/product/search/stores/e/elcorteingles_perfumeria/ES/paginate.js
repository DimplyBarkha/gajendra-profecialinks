
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_perfumeria',
    nextLinkSelector: '#pagination-next > a',
    loadedSelector: '.products_list-item:nth-last-child(1)',
    mutationSelector: null,
    spinnerSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'elcorteingles.es',
    zipcode: '',
  },
};
