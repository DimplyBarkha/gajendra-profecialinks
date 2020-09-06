
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UAE',
    store: 'sharafdg',
    nextLinkSelector: null,
    mutationSelector: 'div[class="search-results"] div div[class="search-text"]',
    spinnerSelector: null,
    loadedSelector: 'div[class="search-results"]',
    noResultsXPath: 'div[id="no-results-message"]',
    openSearchDefinition: null,
    domain: 'sharafdg.com',
    zipcode: '',
  },
};
