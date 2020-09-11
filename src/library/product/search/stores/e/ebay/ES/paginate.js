
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'ebay',
    nextLinkSelector: 'a.pagination__next:not([aria-disabled])',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.srp-results > li[data-view]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'ebay.es',
    zipcode: '',
  },
};
