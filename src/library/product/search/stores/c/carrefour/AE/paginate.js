
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AE',
    store: 'carrefour',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[data-testid="scrollable-list-view"]',
    noResultsXPath: '//h2[@data-testid="no-result-text"]',
    openSearchDefinition: null,
    domain: 'carrefouruae.com',
    zipcode: "''",
  },
};
