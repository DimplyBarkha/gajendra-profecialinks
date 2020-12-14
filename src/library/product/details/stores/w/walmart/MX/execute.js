
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'MX',
    store: 'walmart',
    domain: 'walmart.com.mx',
    loadedSelector: "div[class^='product-details_productDetails']",
    noResultsXPath: "//p[contains(text(),'Es posible que la página que estás buscando no exista')]",
    zipcode: '',
  },
};
