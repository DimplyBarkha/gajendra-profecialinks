
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CZ',
    store: 'fany',
    nextLinkSelector:'ul.pagination a.btn-pager-next:not([disabled])',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.category-body',
    noResultsXPath: '//div[@class="alert alert-info"]',
    openSearchDefinition: null,
    domain: 'fany.cz',
    zipcode: '',
  },
};
