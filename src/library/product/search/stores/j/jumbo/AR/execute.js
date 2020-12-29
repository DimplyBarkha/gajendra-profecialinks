
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AR',
    store: 'jumbo',
    domain: 'jumbo.ar',
    url: 'https://www.jumbo.com.ar/busca/?ft={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
