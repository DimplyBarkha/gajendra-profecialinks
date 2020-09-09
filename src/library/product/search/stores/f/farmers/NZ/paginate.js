
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NZ',
    store: 'farmers',
    nextLinkSelector: 'li.ish-pagination-sites-list-item.ish-pagination-list-next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'farmers.co.nz',
    zipcode: '',
  },
};
