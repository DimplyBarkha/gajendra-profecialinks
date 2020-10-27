
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AE',
    store: 'carrefouruae',
    nextLinkSelector: 'button[data-testid="trolly-button"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'p[data-testid="page-info-content"]',
    noResultsXPath: '//h2[@data-testid="no-result-text"]',
    openSearchDefinition: null,
    domain: 'carrefouruae.com',
    zipcode: '',
  },
};
