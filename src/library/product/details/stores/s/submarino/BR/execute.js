
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'submarino',
    domain: 'submarino.com.br',
    loadedSelector: 'body html',
    noResultsXPath: '//div[contains(@data-component, "productgrid")]',
    zipcode: '',
  },
};
