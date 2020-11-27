
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'tretti',
    domain: 'tretti.se',
    url: 'https://www.tretti.se/search_result/?keywords={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
