
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'blu',
    domain: 'blu.com',
    loadedSelector: 'div[data-testid="productDetailsBlock"]',
    noResultsXPath: 'div[@id="noreviews"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
