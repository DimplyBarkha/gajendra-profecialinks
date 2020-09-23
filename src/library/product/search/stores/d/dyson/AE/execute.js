
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AE',
    store: 'dyson',
    domain: 'dyson.ae',
    url: 'https://www.dyson.ae/en-AE/catalogsearch/result/?q={searchTerms}',
    noResultsXPath: '//h2[contains(.,"returned no  results")]',
    zipcode: '',
  },
};
