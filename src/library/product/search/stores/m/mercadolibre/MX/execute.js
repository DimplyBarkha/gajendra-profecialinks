
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'mercadolibre',
    domain: 'mercadolibre.com.mx',
    url: 'https://listado.mercadolibre.com.mx/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
