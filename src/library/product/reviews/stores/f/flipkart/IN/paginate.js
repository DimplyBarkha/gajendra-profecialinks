
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'IN',
    store: 'flipkart',
    nextLinkSelector: null,
    nextPageUrlSelector: null,
    nextLinkXpath: '//a/span[contains(text(), "Next")]/parent::node()',
    dateSelector: 'div[@class="date_time"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'flipkart.com',
    zipcode: '',
  },
};
