
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RO',
    store: 'elefant',
    nextLinkSelector: 'button.load-more-products',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'img.product-image',
    noResultsXPath: '//div[@class="no-search-result"]//h1',
    openSearchDefinition: null,
    domain: 'elefant.ro',
    zipcode: '',
  },
};
