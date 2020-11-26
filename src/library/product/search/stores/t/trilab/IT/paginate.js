
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'trilab',
    nextLinkSelector: 'li.item.pages-item-next a.next',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: '#amasty-shopby-overlay[style*="display: block;"]',
    loadedSelector: 'li.product-item',
    loadedXpath: null,
    noResultsXPath: '//div[@id="clerk-search-no-results"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'trilab.it',
    zipcode: "''",
  },
};
