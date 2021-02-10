
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'DE',
    store: 'oxyzig',
    domain: 'oxyzig.de',
    loadedSelector: 'div.productpage',
    noResultsXPath: '//div[contains(@class, "reviews-score") and normalize-space(text()) = "0 reviews"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
