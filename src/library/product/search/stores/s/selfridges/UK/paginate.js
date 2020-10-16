
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    nextLinkSelector: '.c-show-more.o-button.--secondary-cta.initialized',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.listing-items.c-listing-items.initialized',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'selfridges.com',
    zipcode: '',
  },
};
