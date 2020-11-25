
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'rappi_heb',
    domain: 'rappi.com.mx',
    url: 'https://www.rappi.com.mx/tiendas/superama/s?store_type=superama&query={searchTerms}',
    loadedSelector: 'div.products-container',
    noResultsXPath: null,
    zipcode: '',
  },
};
