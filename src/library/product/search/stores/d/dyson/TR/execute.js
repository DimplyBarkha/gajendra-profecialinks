
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'TR',
    store: 'dyson',
    domain: 'dyson.com.tr',
    url: 'https://www.dyson.com.tr/catalogsearch/result/?q={searchTerms}',
    loadedSelector: '.search-results__result',
    noResultsXPath: '//h2[contains(.,"aramanız hiçbir sonuç vermedi")]',
    zipcode: '',
  },
};
