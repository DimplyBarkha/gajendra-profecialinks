
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'DE',
    store: 'vapstore',
    domain: 'vapstore.de',
    loadedSelector: 'div#content',
    noResultsXPath: '//div[@class="no_reviews"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
