
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'FR',
    store: 'amazon',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, ul.a-pagination li.a-last:not(.a-disabled) a',
    nextLinkXpath: '//span[contains(@class, "celwidget")]//li[@class="a-last" and not(contains(@class, "a-disabled"))]',
    mutationSelector: 'span[cel_widget_id="UPPER-RESULT_INFO_BAR-0"] div>span[dir="auto"]:first-of-type',
    spinnerSelector: 'div.s-result-list-placeholder:not([class*="hidden"])',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'amazon.fr',
    zipcode: "''",
  },
};
