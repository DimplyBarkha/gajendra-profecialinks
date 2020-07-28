module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    loadedSelector: '.PaginateItems',
    nextLinkSelector: 'button[aria-label="Next page"]:not([disabled])',
    openSearchDefinition: null,
    domain: 'kroger.com',
  },
};
