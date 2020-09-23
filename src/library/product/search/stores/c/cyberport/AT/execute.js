
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'cyberport',
    domain: 'cyberport.at',
    url: 'https://www.cyberport.at/tools/search-results.html?productsPerPage=24&sort=popularity&q={searchTerms}&page={page}',
    // loadedSelector: 'body',
    loadedSelector: 'div.productsList',
    noResultsXPath: null,
    zipcode: '',
  },
};
