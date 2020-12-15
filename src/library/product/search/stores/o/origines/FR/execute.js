
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'origines',
    domain: 'origines.fr',
    url: 'https://www.origines-parfums.com/fr/catalogsearch/result?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
