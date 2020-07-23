
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'amazonMsReviews',
    domain: 'amazon.it',
    url: 'https://www.amazon.it/product-reviews/{searchTerms}/?sortBy=recent',
    loadedSelector: 'div[data-hook="review"]',
    noResultsXPath: '//div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "a-section a-spacing-top-large a-text-center no-reviews-section")]',
    zipcode: '',
  },
};
