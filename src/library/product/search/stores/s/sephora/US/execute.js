
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'sephora',
    domain: 'sephora.com',
    url: 'https://www.sephora.com/search?keyword={searchTerms}&pageSize=150',
    loadedSelector: 'div[data-comp="ProductGrid "] a',
    noResultsXPath: '//h1[contains(., "0 Product results")]',
    zipcode: '',
  },
};