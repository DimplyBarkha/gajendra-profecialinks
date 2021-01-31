
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'KO',
    store: 'coupang',
    domain: 'coupang.com',
    loadedSelector: null,
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
////div[contains(@class, "sdp-review__article__no-review")]