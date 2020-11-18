
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'magazineluiza',
    domain: 'magazineluiza.com.br',
    loadedSelector: 'div.showcase-product',
    noResultsXPath: "//div[@id='showcase']//ul[@role='main']",
    zipcode: '',
  },
};
