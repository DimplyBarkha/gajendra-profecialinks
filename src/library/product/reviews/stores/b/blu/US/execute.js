
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'blu',
    domain: 'blu.com',
    loadedSelector: 'div[data-testid="pageShellBody"]',
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
