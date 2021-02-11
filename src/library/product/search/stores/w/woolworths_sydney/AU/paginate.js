
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'woolworths_sydney',
    nextLinkSelector: null,
    nextLinkXpath: '//span[contains(text(),"Go to Next Page")]/../i',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.ng-trigger-staggerFadeInOut div.product-grid--tile',
    loadedXpath: null,
    noResultsXPath: '//span[contains(text(),"Unfortunately, we could")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'woolworths.com.au',
    zipcode: '',
  },
};
