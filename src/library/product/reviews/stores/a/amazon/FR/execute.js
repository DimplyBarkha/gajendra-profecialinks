
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'FR',
    store: 'amazon',
    domain: 'amazon.fr',
    loadedSelector: '[data-hook="review"]',
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
