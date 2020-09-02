
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'walmart',
    domain: 'walmart.ca',
    loadedSelector: 'h1[data-automation="product-title"]',
    noResultsXPath: '//h1[contains(text(),"Clean up in Aisle")]',
    zipcode: '',
  },
};
