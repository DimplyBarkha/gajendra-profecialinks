
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'galaxus',
    domain: 'galaxus.ch',
    url: 'https://www.galaxus.ch/de/search?q={searchTerms}',
    loadedSelector: null,//'article',
    noResultsXPath: null,//"//h2[contains(@class, 'ZZ5g')] = 'Nothing found for'",
    zipcode: '',
  },
};
