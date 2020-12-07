
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'ferguson',
    // nextLinkSelector: 'a.fg-icon-arrow-right.js-page-action:last-child',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      offset: 24,
      template: 'https://www.ferguson.com/category?Ntt={searchTerms}&No={offset}',
    },
    domain: 'ferguson.com',
    zipcode: '',
  },
};
