
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'safeway',
    domain: 'safeway.us',
    url: 'https://www.safeway.com/shop/search-results.html?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
