
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'rappi_chedraui',
    domain: 'rappi.com.mx',
    url: 'https://www.rappi.com.mx/tiendas/chedraui/s?store_type=chedraui&query={searchTerms}',
    loadedSelector: 'div.products-container',
    //noResultsXPath: '//div[@class="no-results ng-star-inserted"]',
    zipcode: '',
  },
};
