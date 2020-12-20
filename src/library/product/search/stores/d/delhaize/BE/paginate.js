
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'delhaize',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.ProductSearchResultsPage',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'delhaize.be',
    zipcode: '',
  },
};
