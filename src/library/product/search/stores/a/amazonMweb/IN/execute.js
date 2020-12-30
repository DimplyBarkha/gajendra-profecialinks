module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'amazonMweb',
    domain: 'amazon.in',
    url: 'https://www.amazon.in/s?k={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
  },
};
