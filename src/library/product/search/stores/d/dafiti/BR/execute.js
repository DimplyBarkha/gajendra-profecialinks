
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'dafiti',
    domain: 'dafiti.com.br',
    url: 'https://www.dafiti.com.br/catalog/?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
