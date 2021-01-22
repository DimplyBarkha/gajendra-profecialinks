
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'voussert',
    domain: 'voussert.fr',
    url: 'https://www.voussert.fr/Resultats.aspx?Search={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
