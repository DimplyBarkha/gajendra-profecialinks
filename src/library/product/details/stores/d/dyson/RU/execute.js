
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'dyson',
    domain: 'dyson.ru',
    loadedSelector: 'div[class*="product-shop"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
