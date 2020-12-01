
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PL',
    store: 'eobuwie',
    domain: 'eobuwie.com.pl',
    loadedSelector: 'div.product-view',
    noResultsXPath: "//h1[contains(text(),'404 - Nie znaleziono strony')]",
    zipcode: '',
  },
};
