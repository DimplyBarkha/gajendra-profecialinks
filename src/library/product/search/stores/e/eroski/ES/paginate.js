
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'ES',
    store: 'eroski',
    // nextLinkSelector: null,
    // mutationSelector: null,
    // spinnerSelector: null,
    // loadedSelector: 'div[id=productListZone] >div',
    loadedSelector: 'div[id=productListZone] > div.product-item-lineal',
    noResultsXPath: '//p[@class="lineal-products-no-products"]',
    // openSearchDefinition: null,
    domain: 'supermercado.eroski.es',
    zipcode: '',
  },
};
