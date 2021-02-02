
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IN',
    store: 'jiomart',
    domain: 'jiomart.com',
    loadedSelector: 'main#maincontent',
    noResultsXPath: '//div[@class="empty_listing"]',
    zipcode: '',
  },
};
