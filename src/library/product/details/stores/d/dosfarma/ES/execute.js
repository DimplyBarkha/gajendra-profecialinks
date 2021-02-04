
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'dosfarma',
    domain: 'dosfarma.com',
    loadedSelector: 'div.product_primary',
    noResultsXPath: '//article[contains(.,"Este producto ya no esta disponible")]',
    zipcode: '',
  },
};
