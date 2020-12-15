
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'blu',
    domain: 'blu.com',
    url: 'https://www.blu.com/en/US/search?q={searchTerms}',
    loadedSelector: 'div.product-item',
    noResultsXPath: '//div[@data-testid="notFoundPage"]',
    zipcode: '',
  },
};
