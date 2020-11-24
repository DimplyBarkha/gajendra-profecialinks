
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'williams-sonoma',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.product-list li.product-cell',
    loadedXpath: null,
    noResultsXPath: '//p[@class="no-results-tip-copy"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'williams-sonoma.com',
    zipcode: "''",
  },
};
