module.exports = {
  // implements: 'product/search/paginate',
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'CL',
    store: 'paris',
    nextLinkSelector: 'div[class*="pagination-mobile"] div[class*="float-right"] a[class*="active"] +a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul#search-result-items',
    noResultsXPath: '//p[@class="not-found-search"]',
    openSearchDefinition: null,
    domain: 'paris.cl',
    zipcode: '',
  },
};