
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'woolworths',
    domain: 'woolworths.com.au',
    url: 'woolworths.com.au/shop/search/products?searchTerm={searchTerms}',
    loadedSelector: 'div.ng-trigger.ng-trigger-staggerFadeInOut>div',
    noResultsXPath: '//span[@class="no-results-primary-text"]',
    zipcode: '',
  },
};
