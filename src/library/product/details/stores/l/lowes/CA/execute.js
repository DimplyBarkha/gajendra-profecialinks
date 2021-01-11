
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'lowes',
    domain: 'lowes.ca',
    loadedSelector: 'div[id="product-header"]',
    noResultsXPath: '//div[@class="error-page"]|//div[@id="products-tab"]//p[contains(@class,"search-results-nothing-found")]',
    zipcode: null,
  },
};
