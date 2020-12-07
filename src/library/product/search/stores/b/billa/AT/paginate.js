// @ts-nocheck

module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'billa',
    // nextLinkSelector: 'button[ng-click="pagination.selectPage("next")"]',
    nextLinkSelector: 'button.pagination__item--next:not([disabled])',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    // noResultsXPath: '//div[@class="tile-view-grid__no-products"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'billa.at',
    zipcode: '',
  },
};
