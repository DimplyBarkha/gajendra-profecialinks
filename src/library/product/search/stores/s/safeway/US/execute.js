
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'safeway',
    domain: 'safeway.com',
    url: 'https://www.safeway.com/shop/search-results.html?q={searchTerms}&zipcode=94611',
    loadedSelector: '#search-grid_0 > div:nth-child(1) > product-item > div',
    noResultsXPath: '//h1[contains(.,"no results found")]',
  },
};