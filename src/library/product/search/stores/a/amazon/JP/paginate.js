
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'JP',
    store: 'amazon',
    nextLinkSelector: null,
    nextLinkXpath: '//ul[@class="a-pagination"]//li[@class="a-last" and not(contains(@class, "a-disabled"))]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.sg-col-inner',
    loadedXpath: null,
    noResultsXPath: '/html//span[@data-component-type="s-search-results"][not(//*[contains(@class,"s-main-slot") and contains(@class,"s-search-results")])]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'amazon.co.jp',
    zipcode: '',
  },
};
