
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'DE',
    store: 'vapstore',
    domain: 'vapstore.de',
    loadedSelector: 'div.review.panel',
    noResultsXPath: '//div[contains(@class, "add-review m0")]//p[contains(text(),"Geben Sie die erste Bewertung für diesen Artikel ab und helfen Sie Anderen bei der Kaufenscheidung:")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
