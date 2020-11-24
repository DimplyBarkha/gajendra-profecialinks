
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'lenstore',
    nextLinkSelector: '#Main > div.o-outer > div > div.listPageMain > div.list-page__tab-content > div.list-page__tab-panel.active.js-list-page__tab-panel > div.search-results-filter-bottom > div > nav > a._pagination__link._pagination__link--next',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'lenstore.co.uk',
    zipcode: '',
  },
};
