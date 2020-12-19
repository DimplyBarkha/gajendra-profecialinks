module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    // loadedSelector: '.PaginateItems',
    spinnerSelector: '.kds-LoadingSpinner-spinner',
    // loadedSelector: '[data-testid="SearchGridHeader-title"]',
    // nextLinkSelector: 'button[aria-label="Next page"]:not([disabled])',
    nextLinkSelector: 'a.kds-Pagination-link.active + a.kds-Pagination-link',
    openSearchDefinition: null,
    noResultsXpath: '//*[contains(.,"Sorry, there are currently no items to display.")]',
    domain: 'kroger.com',
  },
};
