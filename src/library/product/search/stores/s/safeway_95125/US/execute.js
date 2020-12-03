
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'safeway_95125',
    domain: 'safeway.com',
    url: 'https://www.safeway.com/shop/search-results.html?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '95125',
  },
};
