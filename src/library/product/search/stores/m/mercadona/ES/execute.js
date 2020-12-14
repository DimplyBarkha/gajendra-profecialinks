
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'mercadona',
    domain: 'mercadona.es',
    url: 'https://tienda.mercadona.es/search-results?query={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '46008',
  },
};
