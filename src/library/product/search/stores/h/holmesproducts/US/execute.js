
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'holmesproducts',
    domain: 'holmesproducts.com',
    url: 'https://www.holmesproducts.com/search?q={searchTerms}',
    loadedSelector: 'ul[id*="search-result-items"]',
    noResultsXPath: '//div[contains(@class,"responsive-slot no-hits-container")] | //div[contains(@id,"primary")]/p[contains(text(),"resulted in no products")] | //span[contains(@class,"search-result-count") and contains(.,"no product search result")]',
    zipcode: '',
  },
};
