
module.exports = {
  // implements: 'product/reviews/paginate',
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'totalwine',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'totalwine.com',
    zipcode: '',
  },
};
