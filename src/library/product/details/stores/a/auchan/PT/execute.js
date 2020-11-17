module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PT',
    store: 'auchan',
    domain: 'auchan.pt',
    loadedSelector: 'div[class="product-item-header"] > a',
    noResultsXPath: '//div[contains(@class,"no-results")]',
    zipcode: '',
  },
};
