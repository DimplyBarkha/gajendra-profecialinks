
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'carrefour',
    domain: 'carrefour.fr',
    loadedSelector: 'div.product-list',
    noResultsXPath: '//div[@class="error-block"]/div',
    zipcode: '',
  },
};
