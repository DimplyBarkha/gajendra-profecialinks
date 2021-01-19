
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AR',
    store: 'mercadolibre',
    domain: 'mercadolibre.com.ar',
    url: 'https://listado.mercadolibre.com.ar/{searchTerms}_Tienda_pedidosfarma#D[A:{searchTerms},O:pedidosfarma]',
    loadedSelector: 'section.ui-search-results',
    noResultsXPath: '//div[@class="ui-search"]/div[contains(@class, "rescue")]',
    zipcode: '',
  },
};
