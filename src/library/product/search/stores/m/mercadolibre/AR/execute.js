
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AR',
    store: 'mercadolibre',
    domain: 'mercadolibre.com.ar',
    url: 'https://listado.mercadolibre.com.ar/{searchTerms}#D',
    loadedSelector: 'ol[class*="search-layout--stack"]',
    noResultsXPath: '//div[@class="ui-search"]/div[contains(@class, "rescue")]',
    zipcode: '',
  },
};
