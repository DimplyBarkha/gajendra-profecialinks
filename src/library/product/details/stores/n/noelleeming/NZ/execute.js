
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NZ',
    store: 'noelleeming',
    domain: 'noelleeming.co.nz',
    loadedSelector: 'div.slick-slide a img',
    noResultsXPath: "//div[contains(@class, 'center-max-width')]/h1[contains(text(), 'Page not found')]",
    zipcode: '',
  },
};
