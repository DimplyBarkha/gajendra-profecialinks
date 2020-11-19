
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'primor',
    // nextLinkSelector: '[id="pagination_next_bottom"] a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'primor.eu',
    zipcode: '',
  },
};
