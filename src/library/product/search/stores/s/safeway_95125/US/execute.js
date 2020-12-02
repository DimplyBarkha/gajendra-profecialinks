
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'safeway_95125',
    domain: 'safeway_95125.us',
    url: 'https://www.safeway.com/shop/search-results.html?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
