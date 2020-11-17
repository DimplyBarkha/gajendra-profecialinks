
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'kalunga',
    domain: 'kalunga.com.br',
    url: 'https://www.kalunga.com.br/busca/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  }
};
