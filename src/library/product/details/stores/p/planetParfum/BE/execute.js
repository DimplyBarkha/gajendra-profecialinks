
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'planetParfum',
    domain: 'planetparfum.com',
    loadedSelector: 'div.pdp-main',
    noResultsXPath: '//div[@class="error-page-message-dotted"]|//h1[contains(text(), "Page non trouvée")]|//div[@class="no-hits-headline"]',
    zipcode: '',
  },
};
