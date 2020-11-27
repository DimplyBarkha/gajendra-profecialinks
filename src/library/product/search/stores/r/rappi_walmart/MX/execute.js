
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'rappi_walmart',
    domain: 'rappi.com.mx',
    url: 'https://www.rappi.com.mx/tiendas/walmart/s?store_type=walmart&query={searchTerms}',
    loadedSelector: 'div.products-container',
    // noResultsXPath: null,
    zipcode: '',
  },
};
