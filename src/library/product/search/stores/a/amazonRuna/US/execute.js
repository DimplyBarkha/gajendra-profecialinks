module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonRuna',
    domain: 'amazon.com',
    url: 'https://www.amazon.com/s?k={searchTerms}&rh=p_89%3ARUNA',
    loadedSelector: null,
    noResultsXPath: null,
  },
};
