module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'marionnaud',
    domain: 'marionnaud.ch',
    url: 'https://www.marionnaud.ch/de/search/results?page=0&resultsForPage=20&q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
