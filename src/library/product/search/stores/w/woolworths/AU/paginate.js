
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'AU',
    store: 'woolworths',
    nextLinkXpath: '//a[@class="paging-next ng-star-inserted"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.ng-trigger.ng-trigger-staggerFadeInOut>div',
    loadedXpath: '//div[contains(@class,"product-grid ng-trigger ng-trigger-staggerFadeInOut")]/div',
    noResultsXPath: '//span[@class="no-results-primary-text"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'woolworths.com.au',
    zipcode: '',
  },
};
