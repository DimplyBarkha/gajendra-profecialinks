module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    loadedSelector: '.PaginateItems',
    // nextLinkSelector: 'li.Pagination-item.Pagination-next:not(.is-disabled)> a',
    nextLinkSelector: 'button[aria-label="Next page"]:not([disabled])',
    openSearchDefinition: null,
    domain: 'kroger.com',
  },
};
