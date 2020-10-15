
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'googleshopping',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.productCardContainer',
    noResultsXPath: '//div[@class="browseModuleContent bcNotificationModule ng-star-inserted"]',
    openSearchDefinition: null,
    domain: 'shopping.google.com',
    zipcode: '',
  },
};
