module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'argos',
    domain: 'argos.co.uk',
    loadedSelector: 'h2[data-test*="product-name"]',
    noResultsXPath: '//div[@id="noreviews"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
