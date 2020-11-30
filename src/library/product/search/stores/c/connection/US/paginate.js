module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'connection',
    nextLinkSelector: '.pager-page.active ~ .pager-page',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'connection.com',
    zipcode: '',
  },
};
