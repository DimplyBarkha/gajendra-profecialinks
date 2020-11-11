
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'officeworks',
    nextLinkSelector: 'li.next-button a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-ref="tile-grid-container"]',
    noResultsXPath: '//div[@data-ref="search-no-results"]',
    resultsDivSelector: 'div[data-ref*="product-tile"]',
    openSearchDefinition: null,
    domain: 'officeworks.com.au',
    zipcode: '',
  },
};
