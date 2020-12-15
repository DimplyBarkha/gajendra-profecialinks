
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'marionnaud',
    domain: 'marionnaud.fr',
    url: 'https://www.marionnaud.fr/search/?text={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
