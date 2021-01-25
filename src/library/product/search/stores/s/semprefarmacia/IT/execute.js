
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'semprefarmacia',
    domain: 'semprefarmacia.it',
    url: 'https://www.semprefarmacia.it/ricerca-prodotti.html?strpro={searchTerms}',
    loadedSelector: 'div.well.clearfix div.div_prod_griglia.ombra_div',
    noResultsXPath: '//div[@class="tesros12"]/b',
    zipcode: '',
  },
};
