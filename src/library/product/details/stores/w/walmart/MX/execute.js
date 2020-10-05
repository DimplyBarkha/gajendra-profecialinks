
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'MX',
    store: 'walmart',
    domain: 'walmart.com.mx',
    loadedSelector: "div[data-automation-id*='hero-image'] img",
    noResultsXPath: "//div[contains(@class,'products_noResultsWrapper')]",
    zipcode: '',
  },
};
