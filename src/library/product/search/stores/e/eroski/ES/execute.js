
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'eroski',
    domain: 'supermercado.eroski.es',
    url: 'https://supermercado.eroski.es/es/search/results/?q={searchTerms}',
    loadedSelector: 'div[id=productListZone] > div.product-item-lineal',
    noResultsXPath: '//p[@class="lineal-products-no-products"]',
    zipcode: '',
  },
};
