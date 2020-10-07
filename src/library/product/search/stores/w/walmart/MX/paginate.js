
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'walmart',
    nextLinkSelector: 'span[data-automation-id="pagination-right-click"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-testid="products-grid"]',
    noResultsXPath: '//*[@data-automation-id="no-result-text"]',
    openSearchDefinition: null,
    domain: 'walmart.com.mx',
    zipcode: '',
  },
};
