
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'keshop',
    domain: 'keshop.com',
    loadedSelector: '.prod-container',
    noResultsXPath: '//div[@class="pagenotfound"]',
    zipcode: '',
  },
};
