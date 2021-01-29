module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CL',
    store: 'lider',
    domain: 'lider.cl',
    url: 'https://www.lider.cl/supermercado/search?Ntt={searchTerms}',
    // 'https://www.lider.cl/supermercado/search?N=&No=0&Nrpp=1200&Ntt={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};