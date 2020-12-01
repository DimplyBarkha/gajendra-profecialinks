
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'lidl',
    nextLinkSelector: "a[rel='next']:not([class*='disabled'])",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.product-grid__section',
    noResultsXPath: '//h2[contains(text(), "Für Ihren Suchbegriff konnte leider keine")]',
    openSearchDefinition: null,
    domain: 'lidl.de',
    zipcode: '',
  },
};
