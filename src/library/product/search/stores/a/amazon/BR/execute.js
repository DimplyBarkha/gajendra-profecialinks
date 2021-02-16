
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'amazon',
    domain: 'amazon.com.br',
    url: 'https://www.amazon.com.br/s?k={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
