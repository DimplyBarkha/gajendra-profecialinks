
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PT',
    store: 'worten',
    nextLinkSelector: 'li.pagination-next a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.w-product__image',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'worten.pt',
    zipcode: '',
  },
};
