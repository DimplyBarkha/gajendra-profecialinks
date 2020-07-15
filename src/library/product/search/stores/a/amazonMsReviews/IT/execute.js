
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'amazonMsReviews',
    domain: 'amazon.it',
    url: 'https://www.amazon.it/product-reviews/{searchTerms}/?sortBy=recent',
    loadedSelector: 'div[data-hook="review"]',
    noResultsXPath: '//div[contains(@class, "no-reviews-section")]',
    zipcode: ''
  },
};
