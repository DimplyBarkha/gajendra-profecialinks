
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'bestbuy',
    nextLinkSelector: 'a.sku-list-page-next:not(.disabled)',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'li.sku-item[data-sku-id]',
    loadedXpath: null,
    noResultsXPath: '//h3[@class="no-results-message"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'bestbuy.com',
    zipcode: "''",
  },
};
