
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'superama',
    domain: 'superama.com.mx',
    url: 'https://www.superama.com.mx/buscar/{searchTerms}',
    //url: 'https://www.superama.com.mx/buscador/resultado?busqueda={searchTerms}',
    loadedSelector: 'div.portfolio.full-portfolio.grids ul li',
    noResultsXPath: '//div[@id="conten_error"]/@style[contains(.,"block")]',
    zipcode: '',
  },
};
