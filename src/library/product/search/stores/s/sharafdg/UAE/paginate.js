
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UAE',
    store: 'sharafdg',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="search-results"]',
    noResultsXPath: 'div[id="no-results-message"]',
    openSearchDefinition: {
      template: 'https://uae.sharafdg.com/?q={searchTerms}&post_type=product&page={page}',
    },
    domain: 'sharafdg.com',
    zipcode: '',
  },
};
