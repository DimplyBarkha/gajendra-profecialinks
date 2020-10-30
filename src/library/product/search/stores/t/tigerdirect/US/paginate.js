
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'tigerdirect',
    nextLinkSelector: 'a[title="Next page"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'tigerdirect.com',
    zipcode: '',
  },
};
