
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CO',
    store: 'rappi_farmatodo',
    domain: 'rappi.com.co',
    url: 'https://www.rappi.com.co/tiendas/farmatodo-super/s?store_type=farmatodo_super&query={searchTerms}',
    loadedSelector: 'div.products-container',
    //noResultsXPath: '//div[@class="no-results ng-star-inserted"]',
    zipcode: '',
  },
};
