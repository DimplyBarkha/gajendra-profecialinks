
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'dyson',
    domain: 'dyson.in',
    url: 'https://www.dyson.in/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.row--miniscule',
    noResultsXPath: '//*[contains(text(),"no results")]',
    zipcode: '',
  },
};
