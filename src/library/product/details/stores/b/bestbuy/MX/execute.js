
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'MX',
    store: 'bestbuy',
    domain: 'bestbuy.com.mx',
    loadedSelector: 'div[class="grid-manager container"]',
    noResultsXPath: '//div[@class="container error-message"]',
    zipcode: '',
  },
};
