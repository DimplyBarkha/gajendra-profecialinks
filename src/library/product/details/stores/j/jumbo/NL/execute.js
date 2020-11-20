
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    domain: 'jumbo.com',
    loadedSelector: 'div[data-testautomation="pdp-card"]',
    noResultsXPath: '//div[@class="jum-error-message"]',
    zipcode: '',
  },
};
