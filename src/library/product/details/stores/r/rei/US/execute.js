
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'rei',
    domain: 'rei.com',
    loadedSelector: 'div#product-container',
    noResultsXPath: "//p[contains(text(),'The page you're looking for is not available for one of the following reasons')]",
    zipcode: '',
  },
};
