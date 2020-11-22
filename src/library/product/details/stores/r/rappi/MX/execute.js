
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'rappi',
    domain: 'rappi.com.mx',
    url: null,
    loadedSelector: '//div[@class="store-products"]',
    noResultsXPath: '//div[contains(@class,"no-results ng-star-inserted")]',
    zipcode: '',
  },
};
