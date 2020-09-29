
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'dyson',
    domain: 'dyson.com.au',
    url: 'https://www.dyson.com.au/catalogsearch/result/?q={searchTerms}',
    loadedSelector: '.search-results__result',
    noResultsXPath: '//h2[contains(.,"returned no  results")]',
    zipcode: '',
  },
};
