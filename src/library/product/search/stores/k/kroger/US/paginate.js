module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    // loadedSelector: '.PaginateItems',
    loadedSelector: '[data-testid="SearchGridHeader-title"]',
    nextLinkSelector: 'button[aria-label="Next page"]:not([disabled])',
    openSearchDefinition: null,
    noResultsXpath: '//*[contains(.,"Sorry, there are currently no items to display.")]',
    domain: 'kroger.com',
  },
};
