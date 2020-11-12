
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'harristeeter_28203',
    domain: 'harristeeter.com',
    url: 'https://www.harristeeter.com/shop/store/61/search/{searchTerms}',
    loadedSelector: null, // 'div.search-results.section-products.grid-view',
    noResultsXPath: null,
    zipcode: '',
  },
};
