module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    domain: 'bol.com',
    loadedSelector: 'div#product-reviews',
    noResultsXPath: '//div[@data-test="non-deliverable"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
