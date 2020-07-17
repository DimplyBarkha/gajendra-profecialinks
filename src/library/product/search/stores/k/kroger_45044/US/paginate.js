
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'kroger_45044',
    loadedSelector: '.PaginateItems',
    nextLinkSelector: 'li.Pagination-item.Pagination-next:not(.is-disabled)> a',
    openSearchDefinition: null,
    domain: 'kroger.com',
    zipcode: '45044',
  },
};
