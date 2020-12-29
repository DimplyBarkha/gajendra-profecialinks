
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'angeloni',
    domain: 'angeloni.com.br/super',
    url: 'https://www.angeloni.com.br/super/busca?Nrpp=150&Ntt={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
