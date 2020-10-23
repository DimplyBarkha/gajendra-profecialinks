module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'Carrefour',
    domain: 'carrefour.com.br',
    loadedSelector: '.vtex-seller-selector-0-x-sellerMasterContainer',
    noResultsXPath: '//*[contains(@class,"searchNotFoundOops") or contains(@class,"not-found")]',
    zipcode: '',
  },
};
