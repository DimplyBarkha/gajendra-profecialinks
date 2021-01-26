
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'walmart',
    domain: 'walmart.ca',
    loadedSelector: 'div.css-186cfsd, h1[data-automation="product-title"]',
    noResultsXPath: "//h1[contains(text(),'Clean up in Aisle 404!')]",
    zipcode: '',
  },
};
