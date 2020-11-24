
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'lenstore',
    domain: 'lenstore.fr',
    url: 'https://www.lenstore.fr/recherche/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
