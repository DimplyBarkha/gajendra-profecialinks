
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'marionnaud',
    nextLinkSelector: 'a[class="page-link next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[class="product-listing product-grid"] li',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'marionnaud.fr',
    zipcode: '',
  },
};
