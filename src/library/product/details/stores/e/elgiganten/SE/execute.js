
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SE',
    store: 'elgiganten',
    domain: 'elgiganten.se',
    loadedSelector: 'div.product-detail-page',
    noResultsXPath: '/html[not(//div[@class="product-detail-page"])]',
    zipcode: '',
  },
};
