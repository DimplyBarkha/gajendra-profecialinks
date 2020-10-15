
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    nextLinkSelector: '.c-show-more.o-button.--secondary-cta.initialized',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'selfridges.com',
    zipcode: '',
  },
};
