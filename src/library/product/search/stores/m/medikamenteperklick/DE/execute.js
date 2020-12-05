
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'medikamenteperklick',
    domain: 'medikamenteperklick.de',
    url: 'https://www.medikamente-per-klick.de/keywordsearch/searchitem={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
