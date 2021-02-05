
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'jpg',
    domain: 'jpg.fr',
    loadedSelector: 'div[class="col"] div[class="product-sku-wrapper"]',
    noResultsXPath: '//section[@class="error-pages__container col mb-8"]',
    zipcode: '',
  },
};
