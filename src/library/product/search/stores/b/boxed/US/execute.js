
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'boxed',
    domain: 'boxed.com',
    url: 'https://www.boxed.com/products/search/{searchTerms}',
    loadedSelector: '//ul[contains(@class, "g-product-list")]',
    noResultsXPath: '//div[contains(@class, "33b-less")]',
    zipcode: '',
  },
};
