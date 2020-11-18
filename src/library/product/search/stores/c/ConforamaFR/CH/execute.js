
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'ConforamaFR',
    domain: 'conforama.fr',
    url: 'https://www.conforama.fr/recherche-conforama/{searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
