
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'mecca',
    domain: 'mecca.com.au',
    url: 'https://www.mecca.com.au/search?q={searchTerms}',
    loadedSelector: 'div[class="search-result-content"]',
    noResultsXPath: '//div[@class="no-hits-help"]',
    zipcode: '',
  },
};
