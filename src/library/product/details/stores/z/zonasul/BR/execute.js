
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'zonasul',
    domain: 'zonasul.com.br',
    loadedSelector: 'div.header_info',
    noResultsXPath: "//span[contains(text(),'PAGE NOT FOUND')]",
    zipcode: '',
  },
};
