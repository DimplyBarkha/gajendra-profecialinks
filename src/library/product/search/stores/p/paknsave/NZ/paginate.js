
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'NZ',
    store: 'paknsave',
    nextLinkSelector: 'li.fs-pagination__item > a[aria-label="Next page"]',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.fs-product-card',
    loadedXpath: null,
    noResultsXPath: '//div[@class="no-results]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'paknsaveonline.co.nz',
    zipcode: "''",
  },
};
