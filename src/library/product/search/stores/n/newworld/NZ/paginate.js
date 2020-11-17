
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NZ',
    store: 'newworld',
    nextLinkSelector: 'li.page-selector-item-next a',
    nextLinkXpath: null,
    mutationSelector: 'div.search-results',
    spinnerSelector: null,
    loadedSelector: 'ul.search-result-list li',
    loadedXpath: null,
    noResultsXPath: '//div[@class="no-results"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'newworld.co.nz',
    zipcode: "''",
  },
};
