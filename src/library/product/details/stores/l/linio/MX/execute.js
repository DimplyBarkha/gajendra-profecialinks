
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'MX',
    store: 'linio',
    domain: 'linio.com.mx',
    loadedSelector: 'main[class*="container-fluid"]',
    noResultsXPath: '//div[contains(@class,"empty-search")]',
    zipcode: '',
  },
};
