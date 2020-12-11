
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'macys',
    domain: 'macys.com',
    loadedSelector: 'div[data-auto="product-title"]',
    noResultsXPath: '//div[@data-auto="error-text"]',
    zipcode: '',
  },
};
