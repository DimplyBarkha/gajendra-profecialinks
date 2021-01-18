
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'FR',
    store: 'amazon',
    domain: 'amazon.fr',
    loadedSelector: '[data-hook="review"]',
    noResultsXPath: '//div[@id="no_reviews"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
