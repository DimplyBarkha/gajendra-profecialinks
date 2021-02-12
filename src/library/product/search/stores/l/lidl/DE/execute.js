
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'lidl',
    domain: 'lidl.de',
    url: 'https://www.lidl.de/de/search?query={searchTerms}',
    loadedSelector: '.product-grid__section',
    noResultsXPath: '//h2[contains(text(), "Für Ihren Suchbegriff konnte leider keine")]',
    zipcode: '',
  },
};
