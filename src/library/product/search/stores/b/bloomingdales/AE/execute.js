
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AE',
    store: 'bloomingdales',
    domain: 'bloomingdales.ae',
    url: 'https://bloomingdales.ae/search?q={searchTerms}',
    loadedSelector: 'div.l-product-grid__item',
    noResultsXPath: null,
    zipcode: '',
  },
};
