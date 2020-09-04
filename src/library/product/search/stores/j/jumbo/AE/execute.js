
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AE',
    store: 'jumbo',
    domain: 'jumbo.ae',
    url: 'https://www.jumbo.ae/home/search?q={searchTerms}',
    loadedSelector: 'ul#search-result-items>li',
    noResultsXPath: '//ul[@id="search-result-items" and not(li)] | //div[@id="no-results-found"]',
    zipcode: '',
  },
};
