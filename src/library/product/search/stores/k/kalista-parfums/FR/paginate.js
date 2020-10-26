
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'kalista-parfums',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: 'p.alert.alert-warning',
    openSearchDefinition: null,
    domain: 'kalista-parfums.com',
    zipcode: '',
  },
};
