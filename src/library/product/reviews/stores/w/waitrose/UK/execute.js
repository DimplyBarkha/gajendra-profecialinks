
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    domain: 'waitrose.com',
    loadedSelector: 'section[class="productDetailContainer___1TUHx"]',
    noResultsXPath: '//a[contains(@class,"bv-write-review-label")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
