
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    domain: 'walmart.com',
    loadedSelector: 'div#questions-answers',
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelector: null,
    zipcode: '',
  },
};
