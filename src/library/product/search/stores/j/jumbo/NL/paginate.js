
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    nextLinkSelector: 'span.d-none.d-l-inline',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.rw',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'jumbo.com',
    zipcode: '',
  },
};
