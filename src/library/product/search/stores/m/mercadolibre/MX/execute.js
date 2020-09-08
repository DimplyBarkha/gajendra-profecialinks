
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'mercadolibre',
    domain: 'mercadolibre.com.mx',
    url: 'https://listado.mercadolibre.com.mx/{searchTerms}',
    loadedSelector: 'section[class="ui-search-results"] , div[class="ui-search-main"]',
    noResultsXPath: '//div[contains(@class , "ui-search-rescue")]',
    zipcode: '',
  },
};
