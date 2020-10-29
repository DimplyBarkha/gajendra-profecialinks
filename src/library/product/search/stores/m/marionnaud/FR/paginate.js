
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'marionnaud',
    nextLinkSelector: 'li > a.page-link',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.product-listing.product-grid li',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'marionnaud.fr',
    zipcode: '',
  },
};
