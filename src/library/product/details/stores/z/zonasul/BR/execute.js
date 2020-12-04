
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'zonasul',
    domain: 'zonasul.com.br',
    loadedSelector: 'div.vtex-product-context-provider',
    noResultsXPath: "//span[contains(text(),'PAGE NOT FOUND')]",
    zipcode: '',
  },
};
