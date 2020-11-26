
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'frisco',
    domain: 'frisco.pl',
    url: 'https://www.frisco.pl/q,{searchTerms}/stn,searchResults',
    loadedSelector: null,
    noResultsXPath: null,
  },
};
