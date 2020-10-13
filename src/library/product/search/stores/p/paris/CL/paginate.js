
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CL',
    store: 'paris',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul#search-result-items',
    noResultsXPath: '//p[@class="not-found-search"]',
    openSearchDefinition: null,
    domain: 'paris.cl',
    zipcode: '',
  },
};
