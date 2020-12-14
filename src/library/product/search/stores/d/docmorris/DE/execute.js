module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'docmorris',
    domain: 'docmorris.de',
    url: 'https://www.docmorris.de/search?query={searchTerms}&page=0&resultsPerPage=36',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
