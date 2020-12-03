
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'safeway_94114',
    domain: 'safeway.com',
    url: 'https://www.safeway.com/shop/search-results.html?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '94114',
  },
};
