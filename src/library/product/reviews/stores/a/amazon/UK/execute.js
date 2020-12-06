
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    domain: 'amazon.co.uk',
    loadedSelector: '[data-hook="review"]',
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
