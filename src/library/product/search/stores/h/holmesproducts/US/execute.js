
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'holmesproducts',
    domain: 'holmesproducts.com',
    url: 'https://www.holmesproducts.com/search?q={searchTerms}',
    loadedSelector: 'ul[id*="search-result-items"]',
    noResultsXPath: '//div[contains(@class,"responsive-slot no-hits-container")]',
    zipcode: '',
  },
};
