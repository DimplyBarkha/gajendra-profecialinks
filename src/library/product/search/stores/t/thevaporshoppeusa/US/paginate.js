
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'thevaporshoppeusa',
    nextLinkSelector: 'div.pagination a.btn',
    nextLinkXpath: '//div[@class="pagination"]//a[@class="btn"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product-listing',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'thevaporshoppeusa.com',
    zipcode: "''",
  },
};
