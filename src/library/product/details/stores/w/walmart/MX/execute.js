
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'MX',
    store: 'walmart',
    domain: 'walmart.com.mx',
    loadedSelector: "div[class*='product_container']",
    noResultsXPath: "//div[contains(@class,'no-results_container')]",
    zipcode: '',
  },
};
