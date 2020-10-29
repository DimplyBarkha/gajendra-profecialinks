
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'lowes',
    domain: 'lowes.ca',
    loadedSelector: 'div[id="product-header"]',
    noResultsXPath: '//div[@class="error-page"]',
    zipcode: null,
  },
};
