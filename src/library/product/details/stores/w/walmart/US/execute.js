
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    domain: 'walmart.com',
    loadedSelector: 'body',
    noResultsXPath: '//div[@class="error-page__content"]',
  },
};
