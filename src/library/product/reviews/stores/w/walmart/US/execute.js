
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    domain: 'walmart.com',
    loadedSelector: 'div.frequent-mentions-container',
    noResultsXPath: '//div[@class="error-message-margin error-page-message"]',
    reviewUrl: 'https://www.walmart.com/reviews/product/{id}?sort=submission-desc',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
