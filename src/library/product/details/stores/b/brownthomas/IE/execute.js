
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IE',
    store: 'brownthomas',
    domain: 'brownthomas.com',
    loadedSelector: 'span.product-name-title',
    noResultsXPath: '//p[contains(@class,"no-hits-content-results")]',
    zipcode: '',
  },
};
