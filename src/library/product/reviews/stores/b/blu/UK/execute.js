
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'blu',
    domain: 'blu.com',
    loadedSelector: 'div#reviews',
    noResultsXPath: '//span[contains(text(),"No reviews yet")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
