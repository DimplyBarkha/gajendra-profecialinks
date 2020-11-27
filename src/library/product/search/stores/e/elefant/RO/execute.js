
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RO',
    store: 'elefant',
    domain: 'elefant.ro',
    url: 'https://www.elefant.ro/search?SearchTerm={searchTerms}&StockAvailability=true',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
