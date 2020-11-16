
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'hoogvliet',
    domain: 'hoogvliet.com',
    loadedSelector: 'div.product-info',
    noResultsXPath: "//div[contains(@class,'errorpage-content')]//div[@class='error-text']",
    zipcode: '',
  },
};
