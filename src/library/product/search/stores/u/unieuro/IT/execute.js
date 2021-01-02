module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'unieuro',
    domain: 'unieuro.it',
    url: 'https://www.unieuro.it/online/?q={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
