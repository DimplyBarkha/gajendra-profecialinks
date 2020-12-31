
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'FR',
    store: 'amazon',
    nextLinkSelector: 'span.celwidget li.a-last:not(.a-disabled)',
    nextLinkXpath: '//span[contains(@class, "celwidget")]//li[@class="a-last" and not(contains(@class, "a-disabled"))]',
    mutationSelector: 'span[data-component-type="s-search-results"] div.s-main-slot',
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'amazon.fr',
    zipcode: "''",
  },
};
