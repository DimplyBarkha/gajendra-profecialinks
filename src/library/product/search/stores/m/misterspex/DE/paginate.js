module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    template: null,
    country: 'DE',
    store: 'misterspex',
    nextLinkSelector: 'a.spex-pagination__item.spex-pagination__item--next',
    nextLinkXpath: '//a[@class="spex-pagination__item spex-pagination__item--next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.spex-productList__products',
    loadedXpath: null,
    noResultsXPath: '//div[@data-qa="plp__no_results_search__div"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'misterspex.de',
    zipcode: '',
  }
};
