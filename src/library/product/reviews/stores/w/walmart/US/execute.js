
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    domain: 'walmart.com',
    loadedSelector: '[itemprop="review"]',
    noResultsXPath: '//div[@class="error-message-margin error-page-message"]|//*[contains(@class,"product-review-first-review-text")]',
    reviewUrl: 'https://www.walmart.com/reviews/product/{id}?sort=submission-desc',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
