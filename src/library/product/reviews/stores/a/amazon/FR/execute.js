
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'FR',
    store: 'amazon',
    domain: 'amazon.fr',
    loadedSelector: 'div#a-page',
    noResultsXPath: '//div[@id="no_reviews"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
