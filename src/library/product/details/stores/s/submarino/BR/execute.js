
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'submarino',
    domain: 'submarino.com.br',
    loadedSelector: 'div[class*="product-main-area"][class*="ProductMainAreaUI"]',
    noResultsXPath: '//div[contains(@data-component, "productgrid")]',
    zipcode: '',
  },
};
