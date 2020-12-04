
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'safeway_95125',
    domain: 'safeway.com',
    loadedSelector: 'div[class="product-image-details"]',
    noResultsXPath: '//h2[contains(.,"find that page")]',
    zipcode: '95125',
  },
};
