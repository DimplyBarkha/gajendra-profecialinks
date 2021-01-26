module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
  country: 'US',
  store: 'vons',
  nextLinkSelector: null,
  mutationSelector: null,
  spinnerSelector: null,
  loadedSelector: 'div[class="search-results-grid section"]',
  noResultsXPath: null,
  openSearchDefinition: null,
  domain: 'vons.com',
  zipcode: '',
  },
  };