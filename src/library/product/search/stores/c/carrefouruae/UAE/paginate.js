
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UAE',
    store: 'carrefouruae',
    nextLinkSelector: 'div[class="css-1hbp62g"] button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'p[data-testid="page-info-content"]',
    noResultsXPath: '//h2[@data-testid="no-result-text"]',
    openSearchDefinition: null,
    domain: 'carrefouruae.com',
    zipcode: '',
  },
};
