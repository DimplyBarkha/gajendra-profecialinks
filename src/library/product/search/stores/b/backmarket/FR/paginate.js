
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'backmarket',
    nextLinkSelector: 'button[data-test="pagination-next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section[data-test="product-results-refinement"]',
    noResultsXPath: '//div[@data-test="search-landing-no-result"]',
    openSearchDefinition: null,
    domain: 'backmarket.fr',
    zipcode: '',
  },
};
