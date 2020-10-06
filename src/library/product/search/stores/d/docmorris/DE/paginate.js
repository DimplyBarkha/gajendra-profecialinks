module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'docmorris',
    nextLinkSelector: 'a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#obligatories',
    noResultsXPath: '//*[contains(text(),"Ihrem Suchbegriff kein")]',
    openSearchDefinition: null,
    domain: 'docmorris.de',
    zipcode: '',
  },
};
