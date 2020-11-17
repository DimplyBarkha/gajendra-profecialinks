
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'liverpool',
    domain: 'liverpool.mx',
    url: 'https://www.liverpool.com.mx/tienda?s={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
