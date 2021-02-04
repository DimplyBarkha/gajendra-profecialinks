
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AR',
    store: 'carrefour',
    domain: 'carrefour.com.ar',
    loadedSelector: 'div.product-name',
    noResultsXPath: '//h2[contains(.,"looking for does not exist.")]',
    zipcode: '',
  },
};
