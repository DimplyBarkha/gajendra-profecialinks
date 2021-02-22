
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'IN',
    store: 'flipkart',
    domain: 'flipkart.com',
    loadedSelector: null,
    noResultsXPath: null, // 'div[not(contains(class,"col JOpGWq"))]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};

