module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'johnlewis',
    domain: 'johnlewis.com',
    url: 'https://www.johnlewis.com/search?search-term={searchTerms}',
    loadedSelector: '.PLP_plp__3vv2c',
    noResultsXPath: '/html[not(//title[contains(.,"Search results")])] | //h1[contains(text(),"Sorry, we couldn\'t find any results")]',
    zipcode: '',
  },
};
