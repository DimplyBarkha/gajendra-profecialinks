module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    domain: 'amazon.sa',
    url: 'https://www.amazon.sa/s?k={searchTerms}&language=en&page=1&ref=sr_pg_1',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
