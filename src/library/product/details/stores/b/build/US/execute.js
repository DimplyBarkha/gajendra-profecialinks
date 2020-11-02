
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'build',
    domain: 'build.com',
    loadedSelector: 'div#product-images-container',
    noResultsXPath: "//div[contains(@class, 'pad-content')]/p[contains(text(), 'The product you requested from our site could not be found')]",
    zipcode: '',
  },
};
