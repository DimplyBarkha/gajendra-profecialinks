
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'dyson',
    domain: 'dyson.in',
    url: 'https://www.dyson.in/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.search-results',
    noResultsXPath: '//*[contains(text(),"no results")]',
    zipcode: '',
  },
};
