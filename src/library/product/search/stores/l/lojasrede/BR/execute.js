
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'lojasrede',
    domain: 'lojasrede.com.br',
    url: 'https://busca2.lojasrede.com.br/busca?q={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
