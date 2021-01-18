
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'blu',
    domain: 'blu.com',
    loadedSelector: 'div#reviews',
    noResultsXPath: '//span[contains(text(),"No reviews yet")]',
    // loadedSelector: 'div[data-testid="productDetailsBlock"]',
    // noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
