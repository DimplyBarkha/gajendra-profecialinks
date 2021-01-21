
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'boxed',
    domain: 'boxed.com',
    url: 'https://www.boxed.com/products/search/{searchTerms}',
    loadedSelector: 'div[class*="ab4-less"] > ul[class*="g-product-list"]',
    noResultsXPath: '//span[contains(text(), "Oh no!")]',
    zipcode: '',
  },
};
