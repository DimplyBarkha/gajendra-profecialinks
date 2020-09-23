module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    domain: 'walmart.com',
    loadedSelector: '#hf-home-link',
    noResultsXPath: '//div[@class="error-page__content"] | //div[@class="error-page-content"]',
  },
};
