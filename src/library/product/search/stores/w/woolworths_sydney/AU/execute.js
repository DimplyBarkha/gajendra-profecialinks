
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'woolworths_sydney',
    domain: 'woolworths.com.au',
    url: 'https://www.woolworths.com.au/Shop/Search?searchTerm={searchTerms}',
    loadedSelector: 'div.ng-trigger-staggerFadeInOut div.product-grid--tile',
    noResultsXPath: '//span[contains(text(),"Unfortunately, we could")]',
    zipcode: '',
  },
};
