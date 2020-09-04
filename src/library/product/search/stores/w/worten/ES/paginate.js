
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'worten',
    nextLinkSelector: 'li.pagination-next a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.w-product__image',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'worten.es',
    zipcode: '',
  },
};
