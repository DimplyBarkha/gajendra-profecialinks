
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CZ',
    store: 'fany',
    //nextLinkSelector: 'ul.pagination>li:last-child>a.btn-pager-next',
    nextLinkSelector:'ul.pagination a.btn-pager-next:not([disabled])',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector:'div.category-products',
    //loadedSelector: 'div.catalog-row',
    noResultsXPath: '//div[@class="alert alert-info"]',
    openSearchDefinition: null,
    domain: 'fany.cz',
    zipcode: '',
  },
};
