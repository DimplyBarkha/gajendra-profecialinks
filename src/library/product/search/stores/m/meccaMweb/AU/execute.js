
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'meccaMweb',
    domain: 'mecca.com.au',
    url: 'https://www.mecca.com.au/search?q={searchTerms}',
    loadedSelector: 'div[class="search-result-content"], div[class="shop-grid"]',
    noResultsXPath: '//div[@class="no-hits-help"]',
    zipcode: '',
  },
};
