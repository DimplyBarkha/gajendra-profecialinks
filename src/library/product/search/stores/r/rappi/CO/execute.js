
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CO',
    store: 'rappi',
    domain: 'rappi.com.co',
    url: 'https://www.rappi.com.co/tiendas/exito/s?store_type=hiper&query={searchTerms}',
    loadedSelector: 'div.products-container',
    //noResultsXPath: '//div[@class="no-results ng-star-inserted"]',
    zipcode: '',
  },
};
