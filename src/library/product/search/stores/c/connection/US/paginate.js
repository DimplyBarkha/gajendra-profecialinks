module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'connection',
    //nextLinkSelector: null,
    nextLinkSelector: 'div.search-navigation-footer nav a[aria-label="Next Page"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'connection.com',
    zipcode: '',
  },
};
