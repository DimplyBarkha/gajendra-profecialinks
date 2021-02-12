
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    nextLinkSelector: 'a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'coolblue.nl',
    zipcode: '',
  },
};
