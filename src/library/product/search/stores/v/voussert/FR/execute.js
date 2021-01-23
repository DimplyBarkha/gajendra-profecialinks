
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'voussert',
    domain: 'voussert.fr',
    url: 'https://www.voussert.fr/Resultats.aspx?Search={searchTerms}',
    loadedSelector: 'div.fullGrid.no-space.family-products div.grid25',
    noResultsXPath: null,
    zipcode: '',
  },
};
