module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    loadedSelector: '.PaginateItems',
    nextLinkSelector: 'button[aria-label="Next page"]:not([disabled])',
    openSearchDefinition: null,
    domain: 'kroger.com',
  },
};
