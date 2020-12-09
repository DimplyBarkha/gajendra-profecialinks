
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AT',
    store: 'mpreis',
    domain: 'mpreis.at',
    loadedSelector: 'div.c3-shop-product__media-slider img',
    noResultsXPath: 'h1.c3-page-not-found__title',
    zipcode: '',
  },
};
