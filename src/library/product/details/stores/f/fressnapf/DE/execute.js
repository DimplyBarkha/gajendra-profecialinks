
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'fressnapf',
    domain: 'fressnapf.de',
    loadedSelector: 'div[class="product-detail"]',
    noResultsXPath: 'div[class="error-panel"]',
    zipcode: '',
  },
};
