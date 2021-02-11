module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    domain: 'bol.com',
    loadedSelector: 'div#product-reviews',
    noResultsXPath: '//div[@data-test="non-deliverable"] | //div[@data-test="reviews-no-reviews"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
