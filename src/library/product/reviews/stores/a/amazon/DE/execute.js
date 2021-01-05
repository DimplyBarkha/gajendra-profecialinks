
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    domain: 'amazon.de',
    loadedSelector: '[data-hook="review"]',
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
