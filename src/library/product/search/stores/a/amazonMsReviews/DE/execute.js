
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'amazonMsReviews',
    domain: 'amazon.de',
    url: 'https://www.amazon.de/product-reviews/{searchTerms}/?sortBy=recent',
    loadedSelector: 'div[data-hook=review]',
    noResultsXPath: '//div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "a-section a-spacing-top-large a-text-center no-reviews-section")]',
  },
};
