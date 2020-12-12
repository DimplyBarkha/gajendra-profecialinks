
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'juul',
    domain: 'juul.com',
    url: 'https://www.juul.com/shop#{searchTerms}',
    loadedSelector: 'div.product-listing',
    noResultsXPath: null,
    zipcode: '',
  },
};
