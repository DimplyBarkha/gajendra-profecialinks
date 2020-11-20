
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'vikingdirect',
    domain: 'vikingdirect.nl',
    loadedSelector: 'div[id="productPage"]',
    noResultsXPath: '//div[@id="searchEmpty"]|//div[contains(@class, "error__404")]|//div[@id="heroBanner"]',
    zipcode: '',
  },
};
