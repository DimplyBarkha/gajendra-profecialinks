
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'docmorris',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//h1[contains(.,"Kein Suchergebnis")]',
    openSearchDefinition: null,
    domain: 'docmorris.de',
    zipcode: '',
  },
};
