
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'rappi_heb',
    domain: 'rappi.com.mx',
    url: 'https://www.rappi.com.mx/tiendas/heb/s?store_type=heb&query={searchTerms}',
    loadedSelector: 'div.products-container',
    //noResultsXPath: '//div[@class="no-results ng-star-inserted"]',
    zipcode: '',
  },
};
