
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'carrefour',
    domain: 'carrefour.fr',
    loadedSelector: 'div[id="product-detail-page"],li.product-grid-item',
    noResultsXPath: '//div[@class="error"]',
    zipcode: '',
  },
};
