
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'marionnaud',
    domain: 'marionnaud.at',
    url: 'https://www.marionnaud.at/search/results?page=0&resultsForPage=20&q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
