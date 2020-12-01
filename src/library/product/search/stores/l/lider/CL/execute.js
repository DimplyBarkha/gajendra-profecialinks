module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CL',
    store: 'lider',
    domain: 'lider.cl',
    url: 'https://www.lider.cl/supermercado/search?Ntt={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};