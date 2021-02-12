
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    domain: 'waitrose.com',
    loadedSelector: 'div.bv-control-bar',
    noResultsXPath: '//a[contains(@class,"bv-write-review-label")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
