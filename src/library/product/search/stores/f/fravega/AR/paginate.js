
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'AR',
    store: 'fravega',
    nextLinkSelector: 'li.ant-pagination-next:not(.ant-pagination-disabled)',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//div[@data-test-id="noItemsResult"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'fravega.com',
    zipcode: '',
  },
};
