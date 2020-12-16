
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'chewy',
    domain: 'chewy.com',
    loadedSelector: 'section[class*="results-products"]',
    noResultsXPath: '//div[contains(@class, "results-error")]//span[contains(text(), "did not match any products")]',
    reviewUrl: 'https://www.chewy.com/s?query={id}&nav-submit-button=',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
