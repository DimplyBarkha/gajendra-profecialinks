
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'dermstore',
    domain: 'dermstore.com',
    loadedSelector: 'div#prod-page',
    noResultsXPath: "//h1[contains(text(),'OOPS!')]",
    zipcode: "''",
  },
};
