
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'MedikamentePerKlick',
    domain: 'medikamenteperklick.de',
    url: 'https://www.medikamente-per-klick.de/keywordsearch/searchitem={searchTerms}',
    loadedSelector: 'div.productsList',
    noResultsXPath: null,
    zipcode: '',
  },
};
