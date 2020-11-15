
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'woolworths',
    domain: 'woolworths.com.au',
    url: 'https://www.woolworths.com.au/Shop/Search?searchTerm={searchTerms}',
    loadedSelector: 'div.ng-trigger-staggerFadeInOut',
    noResultsXPath: '//span[contains(text(),"Unfortunately, we could")]',
    zipcode: "''",
  },
};
