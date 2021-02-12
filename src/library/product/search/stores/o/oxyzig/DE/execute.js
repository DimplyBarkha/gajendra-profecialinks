
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'oxyzig',
    domain: 'oxyzig.de',
    url: 'https://www.oxyzig.de/brands/{searchTerms}/',
    loadedSelector: 'div.collection-products-row',
    noResultsXPath: '//h3[text()="Empfohlene Produkte"]',
    zipcode: '',
  },
};
