
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'hazesmokeshop',
    domain: 'hazesmokeshop.ca',
    loadedSelector: 'div[class="reviews_tab active"]',
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
