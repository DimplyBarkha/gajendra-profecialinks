
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'dyson',
    domain: 'dyson.com.mx',
    url: 'https://www.dyson.com.mx/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.row--miniscule',
    noResultsXPath: '//*[contains(text(),"no results")]',
    zipcode: '',
  },
};
