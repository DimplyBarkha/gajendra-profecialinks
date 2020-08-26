
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NZ',
    store: 'sephora',
    nextLinkSelector: 'a.page.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.products-grid',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'sephora.nz',
    zipcode: '',
  },
};
