
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'boxed',
    domain: 'boxed.com',
    loadedSelector: 'section#product-page',
    noResultsXPath: '//section[@id="error-page"]',
    zipcode: '',
  },
};
