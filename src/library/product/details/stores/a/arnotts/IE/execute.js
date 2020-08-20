
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IE',
    store: 'arnotts',
    domain: 'arnotts.ie',
    loadedSelector: 'div.product-primary-image a',
    noResultsXPath: '//p[@class="no-hits-content-results"]',
    zipcode: '',
  },
};
