
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    domain: 'amazon.de',
    loadedSelector: 'div#a-page',
    noResultsXPath: '//div[@id="no_reviews"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
