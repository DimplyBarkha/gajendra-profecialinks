
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'blu',
    domain: 'blu.com',
    loadedSelector: 'div#__next',
    noResultsXPath: 'div[@id="noreviews"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
