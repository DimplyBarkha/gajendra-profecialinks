
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'UK',
    store: 'waitrose',
    nextLinkSelector: null,
    nextPageUrlSelector: null,
    nextLinkXpath: '//a[contains(@class, "pages-last bv-focusable bv-content-btn-pages-active")]',
    mutationSelector: null,
    spinnerSelector: '#bv-mbox-loading',
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'waitrose.com',
    zipcode: '',
  },
};
