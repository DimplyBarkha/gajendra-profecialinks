
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CO',
    store: 'merqueo',
    domain: 'merqueo.com',
    url: 'https://merqueo.com/bogota/super-ahorro/buscar/{searchTerms}',
    loadedSelector: '.main-layout',
    noResultsXPath: null, // '//div[@class="main-layout"][contains(., "No se encontraron resultados")]',
    zipcode: '',
  },
};
