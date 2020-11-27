
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CO',
    store: 'exito',
    domain: 'exito.com',
    loadedSelector: 'h1.product-detail-vtex-store-components-product-name',
    noResultsXPath: "//span[contains(text(),'PAGE NOT FOUND')]",
    zipcode: '',
  },
};
