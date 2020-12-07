
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'billa',
    domain: 'billa.at',
    url: 'https://www.billa.at/search/results?category=&searchTerm={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
