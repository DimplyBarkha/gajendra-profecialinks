
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'surlatable',
    nextLinkSelector: '.search-result-options.tablet-mobile-show .pagination li.current-page~li a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#primary',
    loadedXpath: null,
    noResultsXPath: '//*[@id="primary"]//div[@class="no-hits-result-header"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'surlatable.com',
    zipcode: "''",
  },
};
