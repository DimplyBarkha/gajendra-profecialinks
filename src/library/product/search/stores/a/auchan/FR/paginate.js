
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'auchan',
    nextLinkSelector: '.ui-pagination--next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div .product-list--container.grid',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'auchan.fr',
    zipcode: '',
  },
};
