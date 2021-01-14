
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'carrefour',
    domain: 'carrefour.fr',
    loadedSelector: 'div.product-list, div#data-produit-card',
    noResultsXPath: '//div[@class="error-block"]/div',
    zipcode: '',
  },
};
