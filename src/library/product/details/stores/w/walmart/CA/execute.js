
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'walmart',
    domain: 'walmart.ca',
    loadedSelector: 'div.css-186cfsd',
    noResultsXPath: "//h1[contains(text(),'Clean up in Aisle 404!')]",
    zipcode: '',
  },
};
