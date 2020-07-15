
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonMsReviews',
    domain: 'amazon.com',
    url: 'https://www.amazon.it/product-reviews/{searchTerms}/?sortBy=recent',
    loadedSelector: 'div[data-hook=review]',
    noResultsXPath: '//div[contains(@class, "no-reviews-section")]',
  },
};
