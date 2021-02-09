
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'IT',
    store: 'amazon',
    nextLinkSelector: null,
    nextLinkXpath: '//ul[@class="a-pagination"]//li[@class="a-last" and not(contains(@class, "a-disabled"))]',
    mutationSelector: 'div.s-main-slot.s-search-results',
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '/html//span[@data-component-type="s-search-results"][not(//*[contains(@class,"s-main-slot") and contains(@class,"s-search-results")])]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'amazon.it',
    zipcode: '',
  },
};
