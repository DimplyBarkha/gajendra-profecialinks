
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CO',
    store: 'alkosto',
    domain: 'alkosto.com',
    loadedSelector: 'ul[class="products-grid first last odd"] , div[class="product-view"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
