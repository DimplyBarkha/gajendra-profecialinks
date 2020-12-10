
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'mediamarkt',
    domain: 'mediamarkt.nl',
    timeout: 35000,
    loadedSelector: 'aside#product-sidebar',
    noResultsXPath: '//div[contains(@class, "ErrorPage")]',
    zipcode: '',
  },
};
