
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'vons',
    domain: 'vons.com',
    url: 'https://www.vons.com/shop/search-results.html?q={searchTerms}',
    loadedSelector: 'div[class="search-results-grid section"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
