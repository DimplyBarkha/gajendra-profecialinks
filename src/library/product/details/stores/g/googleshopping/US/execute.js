
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'googleshopping',
    domain: 'shopping.google.com',
    loadedSelector: 'div[class^="sg-product"]',
    noResultsXPath: 'div.product-not-found',
    zipcode: '',
  },
};
