
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'vikingdirect',
    domain: 'vikingdirect.nl',
    loadedSelector: 'div[id="productPage"]',
    noResultsXPath: '//div[@id="searchEmpty"]',
    zipcode: '',
  },
};
