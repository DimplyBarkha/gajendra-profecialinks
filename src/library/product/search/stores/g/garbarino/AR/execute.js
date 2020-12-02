
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AR',
    store: 'garbarino',
    domain: 'garbarino.com',
    url: 'https://www.garbarino.com/q/{searchTerms}/srch?',
    loadedSelector: 'div.itemList div.col-xs-12.col-sm-4.col-md-3',
    noResultsXPath: '//h2[@class="gb-error-title" and text()="No hay resultados para esta búsqueda"]',
    zipcode: '',
  },
};
