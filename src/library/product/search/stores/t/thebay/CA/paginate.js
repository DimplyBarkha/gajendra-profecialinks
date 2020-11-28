
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'thebay',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.row.product-grid',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'thebay.com',
    zipcode: '',
  },
};
