
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'bruneau',
    domain: 'bruneau.fr',
    url: 'https://www.bruneau.fr/recherche/result.htm?search={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
