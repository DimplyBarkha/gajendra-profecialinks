
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'woolworths',
    domain: 'woolworths.com.au',
    loadedSelector: 'div.body-container',
    noResultsXPath: '//div[@class="errorPage"]',
    zipcode: '',
  },
};
