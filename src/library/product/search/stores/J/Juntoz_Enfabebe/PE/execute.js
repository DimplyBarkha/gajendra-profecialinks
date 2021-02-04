
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PE',
    store: 'Juntoz_Enfabebe',
    domain: 'enfabebe.juntoz.com',
    url: 'https://enfabebe.juntoz.com/catalogo?keywords={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: '//li[@class="pagination-next ng-scope disabled"]/a',
    zipcode: '',
  },
};
