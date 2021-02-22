
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IL',
    store: 'dyson',
    domain: 'dyson.co.il',
    url: 'https://www.dyson.co.il/en-IL/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.row--miniscule',
    noResultsXPath: '//*[contains(text(),"no results")]',
    zipcode: '',
  },
};
