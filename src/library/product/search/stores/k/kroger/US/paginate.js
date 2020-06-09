
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    nextLinkSelector: 'li.Pagination-item.Pagination-next > a',
    mutationSelector: null,
    spinnerSelector: 'label.kds-Text--s.kds-LoadingSpinner.kds-LoadingSpinner--s',
    loadedSelector: '.PaginateItems',
    openSearchDefinition: null,
    domain: 'kroger.com',
  },
};
