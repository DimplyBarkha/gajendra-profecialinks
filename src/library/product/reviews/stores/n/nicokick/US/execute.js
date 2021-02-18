
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'nicokick',
    domain: 'nicokick.com',
    loadedSelector: 'div#product-review-container',
    noResultsXPath: '//div[@class="product-reviews-summary empty"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
