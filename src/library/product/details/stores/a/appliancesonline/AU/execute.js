
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'appliancesonline',
    domain: 'appliancesonline.com.au',
    loadedSelector: 'body',
    noResultsXPath: '//div[@class="error-page__content"]',
  },
};