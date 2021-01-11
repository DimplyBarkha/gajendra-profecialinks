
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'ahlens',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: '//div[@data-testid="AhSearchResults_noHitsErrorMessage"]',
    openSearchDefinition: null,
    domain: 'ahlens.se',
    zipcode: '',
  },
};
