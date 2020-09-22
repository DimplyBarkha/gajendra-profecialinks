
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NZ',
    store: 'dyson',
    domain: 'dyson.com.nz',
    url: 'https://www.dyson.co.nz/catalogsearch/result/?q={searchTerms}',
    loadedSelector: '.search-results__result',
    noResultsXPath: '//h2[contains(.,"returned no  results")]',
    zipcode: '',
  },
};
