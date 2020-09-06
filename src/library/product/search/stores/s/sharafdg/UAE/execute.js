
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UAE',
    store: 'sharafdg',
    domain: 'sharafdg.com',
    url: 'https://uae.sharafdg.com/?q={searchTerms}&post_type=product',
    loadedSelector: 'div[class="search-results"]',
    noResultsXPath: 'div[id="no-results-message"]',
    zipcode: '',
  },
};
