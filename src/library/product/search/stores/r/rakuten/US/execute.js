
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'rakuten',
    domain: 'rakuten.com',
    url: 'https://www.rakuten.com/compare/prices/search.htm?keywords={searchTerms}&all=1&stype=compare',
    loadedSelector: 'div[id="all-products"]',
    noResultsXPath: '//span[contains(text(),"No Products were found")]',
    zipcode: '',
  },
};
