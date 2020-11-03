module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'Carrefour',
    domain: 'carrefour.com.br',
    loadedSelector: 'img[class*="productImageTag"]',
    noResultsXPath: '//*[contains(@class,"searchNotFoundOops") or contains(@class,"not-found")]',
    zipcode: '',
  },
};
