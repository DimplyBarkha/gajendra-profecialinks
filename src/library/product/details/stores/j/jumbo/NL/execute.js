
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    domain: 'jumbo.com',
    loadedSelector: 'div[data-testautomation="pdp-card"],body>section[class="jum-additional-info row"]',
    noResultsXPath: '//div[@class="jum-error-message"]',
    zipcode: '',
  },
};
