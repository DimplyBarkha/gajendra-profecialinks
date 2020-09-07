
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'sopo',
    domain: 'sopo.at',
    url: 'https://www.sopo.at/search?sSearch={searchTerms}',
    loadedSelector: '.search--results',
    noResultsXPath: null,
    zipcode: '',
  },
};
