
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'blu',
    domain: 'blu.com',
    url: 'https://www.blu.com/en/GB/search?q={searchTerms}',
    loadedSelector: 'div.product-item',
    noResultsXPath: '//div[@data-testid="notFoundPage"]',
    zipcode: '',
  },
};
