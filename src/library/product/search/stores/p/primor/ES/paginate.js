
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'primor',
    nextLinkXpath: '//*[@id="pagination_next_bottom"]/a/i',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'primor.eu',
    zipcode: '',
  },
};
