
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'NZ',
    store: 'paknsave',
    nextLinkSelector: 'li.page-selector-item-next a',
    nextLinkXpath: null,
    mutationSelector: 'div.search-results',
    spinnerSelector: 'div.loading-in-progress',
    loadedSelector: 'div#wrapper ul.search-result-list li',
    loadedXpath: null,
    noResultsXPath: '//div[@class="no-results',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'paknsave.co.nz',
    zipcode: "''",
  },
};
