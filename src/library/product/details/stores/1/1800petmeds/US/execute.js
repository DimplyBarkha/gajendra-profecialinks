
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: '1800petmeds',
    domain: '1800petmeds.com',
    loadedSelector: 'h1[class="product-name"]',
    noResultsXPath: '//div[contains(@class,"no-results-container")]',
    zipcode: '',
  },
};
