module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'ep',
    domain: 'ep.de',
    url: 'https://www.ep.de/search/?text={searchTerms}',
    noResultsXPath: '//h1[contains(.,"Leider ergab Ihre Suche keine Ergebnisse")]',
    zipcode: '',
  },
};
