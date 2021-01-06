
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'google',
    domain: 'google.com',
    url: 'https://www.google.com/search?q={searchTerms}',
    loadedSelector: 'div#result-stats',
    noResultsXPath: null,
    zipcode: '',
  },
};
