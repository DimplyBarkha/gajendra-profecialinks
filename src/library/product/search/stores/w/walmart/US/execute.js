
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    domain: 'walmart.com',
    url: 'https://www.walmart.com/search/search-ng.do?grid=true&search_query={searchTerms}',
    loadedSelector: 'div[data-type="items"]',
    noResultsXPath: '//span[@data-automation-id="zero-results-message"]',
  },
};
