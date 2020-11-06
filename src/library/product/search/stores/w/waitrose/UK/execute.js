
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    domain: 'waitrose.com',
    url: 'https://www.waitrose.com/ecom/shop/search?&searchTerm={searchTerms}',
    loadedSelector: 'div[data-test="product-list"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
