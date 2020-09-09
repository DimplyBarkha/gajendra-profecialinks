
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NZ',
    store: 'farmers',
    domain: 'farmers.co.nz',
    url: 'https://www.farmers.co.nz/search?SearchTerm={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
