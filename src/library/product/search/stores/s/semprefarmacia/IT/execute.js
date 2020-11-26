
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'semprefarmacia',
    domain: 'semprefarmacia.it',
    url: 'https://www.semprefarmacia.it/ricerca-prodotti.html?strpro={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="tesros12"]/b',
    zipcode: '',
  },
};
