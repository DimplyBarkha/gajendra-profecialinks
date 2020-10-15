
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'googleshopping',
    domain: 'shopping.google.com',
    url: 'https://shopping.google.com/u/0/s?m=7867565&sa=X&ved=0ahUKEwjvzIm746rrAhUNK80KHbtCCoAQ2NsDCGA',
    loadedSelector: 'div.productCardContainer',
    noResultsXPath: '//div[@class="browseModuleContent bcNotificationModule ng-star-inserted"]',
    zipcode: '',
  },
};
