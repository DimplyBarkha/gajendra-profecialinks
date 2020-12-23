module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'dermstore',
    domain: 'dermstore.com',
    loadedSelector: 'div.reviews',
    noResultsXPath: '//p[contains(text(),"No Reviews yet")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
