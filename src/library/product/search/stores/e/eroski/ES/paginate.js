
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'eroski',
    // nextLinkSelector: null,
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div[id=productListZone] >div',
    noResultsXPath: '//p[@class="lineal-products-no-products"]',
    // openSearchDefinition: null,
    domain: 'supermercado.eroski.es',
    zipcode: '',
  },
};
